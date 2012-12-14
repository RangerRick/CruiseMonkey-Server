package com.raccoonfink.cruisemonkey.server;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.Credentials;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.AuthCache;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.protocol.ClientContext;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.BasicAuthCache;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.util.EntityUtils;

public class StatusNetService {
	private final HttpHost m_httpHost;
	private final String m_root;
	private final UsernamePasswordCredentials m_credentials;
	private final HttpClient m_httpClient;
	private BasicHttpContext m_context;

	public StatusNetService(final String host, final int port, final String root, final String username, final String password) {
		final HttpHost httpHost = new HttpHost(host, port, "http");
		final UsernamePasswordCredentials credentials = new UsernamePasswordCredentials(username, password);

		m_httpClient = getHttpClient(httpHost, credentials);

		m_httpHost = httpHost;
		m_credentials = credentials;
		m_root = root;
	}

	private DefaultHttpClient getHttpClient(final HttpHost httpHost, final Credentials credentials) {
		final HttpParams params = new BasicHttpParams();
		HttpConnectionParams.setConnectionTimeout(params, 5000);
		HttpConnectionParams.setSoTimeout(params, 5000);

		final DefaultHttpClient httpClient = new DefaultHttpClient(params);
		httpClient.getCredentialsProvider().setCredentials(new AuthScope(httpHost.getHostName(), httpHost.getPort()), credentials);

		final AuthCache authCache = new BasicAuthCache();
		final BasicScheme basicAuth = new BasicScheme();
		authCache.put(httpHost, basicAuth);
		final BasicHttpContext context = new BasicHttpContext();
		context.setAttribute(ClientContext.AUTH_CACHE, authCache);
		
		m_context = context;

		return httpClient;
	}

	public String getHost() {
		return m_httpHost.getHostName();
	}
	
	public int getPort() {
		return m_httpHost.getPort();
	}
	
	public String getUsername() {
		return m_credentials.getUserName();
	}

	public String getRoot() {
		return m_root;
	}

	public void authorize() throws AuthorizationFailureException {
		final HttpPost post = new HttpPost(getRoot() + "/api/help/test.json");
	
		HttpResponse response;
		try {
			response = getResponse(post);
		} catch (final Exception e) {
			throw new AuthorizationFailureException("Failed to query the Status.Net API", e);
		}
		final HttpEntity entity = response.getEntity();

		if (response.getStatusLine().getStatusCode() == 200) return;

	    System.err.println("----------------------------------------");
	    System.err.println("failed authentication:");
	    System.err.println("----------------------------------------");
	    System.err.println(response.getStatusLine());
	    if (entity != null) {
	    	// System.err.println("Response content length: " + entity.getContentLength());
		    try {
		    	entity.writeTo(System.err);
		    	EntityUtils.consume(entity);
			} catch (final IOException e) {
				System.err.println("Failure while consuming the response entity.");
				e.printStackTrace();
			}
	    }

	    throw new AuthorizationFailureException("Unable to authenticate to Status.Net server.  Reason: " +response.getStatusLine());
	}

	protected HttpResponse getResponse(final HttpPost post) throws IOException, ClientProtocolException {
		return m_httpClient.execute(m_httpHost, post, m_context);
	}

	protected void finalize() throws Throwable {
		if (m_httpClient != null) {
			m_httpClient.getConnectionManager().shutdown();
		}
	}
}
