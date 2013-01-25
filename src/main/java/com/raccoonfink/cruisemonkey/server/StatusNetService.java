package com.raccoonfink.cruisemonkey.server;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;

import org.apache.commons.io.IOUtils;
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
import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonToken;

import com.raccoonfink.cruisemonkey.model.User;

public class StatusNetService {
	private final HttpHost m_httpHost;
	private final String m_root;
	private final UsernamePasswordCredentials m_credentials;
	private final HttpClient m_httpClient;
	private BasicHttpContext m_context;
	private final JsonFactory m_jsonFactory = new JsonFactory();
	private boolean m_authorized = false;
	private final int m_timeout = Integer.parseInt(System.getProperty("serverTimeout", "5000"));

	public StatusNetService(final String host, final int port, final String root, final String username, final String password) {
		final HttpHost httpHost = new HttpHost(host, port, "http");
		final UsernamePasswordCredentials credentials = new UsernamePasswordCredentials(username.toLowerCase(), password);

		m_httpClient = getHttpClient(httpHost, credentials);

		m_httpHost = httpHost;
		m_credentials = credentials;
		m_root = root;
	}

	private DefaultHttpClient getHttpClient(final HttpHost httpHost, final Credentials credentials) {
		final HttpParams params = new BasicHttpParams();
		HttpConnectionParams.setConnectionTimeout(params, m_timeout);
		HttpConnectionParams.setSoTimeout(params, m_timeout);
		HttpConnectionParams.setSoKeepalive(params, true);

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
		return m_credentials.getUserName().toLowerCase();
	}

	public String getPassword() {
		return m_credentials.getPassword();
	}

	public String getRoot() {
		return m_root == null? "" : m_root;
	}

	public StatusNetService authorize() throws AuthorizationFailureException {
		System.err.println("StatusNetService::authorize(): username = " + getUsername());
		final HttpPost post = new HttpPost(getRoot() + "/api/help/test.json");
	
		HttpResponse response;
		try {
			response = getResponse(post);
		} catch (final Exception e) {
			throw new AuthorizationFailureException("Failed to query the Status.Net API", e);
		}
		final HttpEntity entity = response.getEntity();

		if (response.getStatusLine().getStatusCode() == 200) {
			post.releaseConnection();
			m_authorized = true;
			return this;
		}

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
				throw new AuthorizationFailureException("I/O exception while parsing response.", e);
			} finally {
				post.releaseConnection();
			}
	    }

	    throw new AuthorizationFailureException("Unable to authenticate to " + m_httpHost.toString() + ".  Reason: " +response.getStatusLine());
	}

	public User getUser() throws UserRetrievalException {
		System.err.println("StatusNetService::getUser(): username = " + getUsername());
		if (!m_authorized) {
			try {
				this.authorize();
			} catch (AuthorizationFailureException e) {
				throw new UserRetrievalException("Unable to authorize user.", e);
			}
		}

		final HttpPost post = new HttpPost(getRoot() + "/api/users/show/" + getUsername() + ".json");
		
		HttpResponse response;
		try {
			response = getResponse(post);
		} catch (final Exception e) {
			post.releaseConnection();
			throw new UserRetrievalException("Failed to query the Status.Net API", e);
		}
		final HttpEntity entity = response.getEntity();

		if (response.getStatusLine().getStatusCode() != 200) {
			post.releaseConnection();
			throw new UserRetrievalException("Unable to retrieve user " + getUsername());
		}

		PipedInputStream inputStream = null;
		PipedOutputStream outputStream = null;
		try {
			final ByteArrayOutputStream out = new ByteArrayOutputStream();
			entity.writeTo(out);
			final ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());

			final User user = new User();

			final String userName = m_credentials.getUserName();
			user.setUsername(userName);
			user.setPassword(m_credentials.getPassword());
			user.setCreatedBy(userName);

			final JsonParser parser = m_jsonFactory.createJsonParser(in);

			JsonToken current = parser.nextToken();
			if (current != JsonToken.START_OBJECT) {
				throw new UserRetrievalException("Unable to parse user data for " + getUsername() + ": no START_OBJECT found.");
		    }

			while (parser.nextToken() != JsonToken.END_OBJECT) {
				final String fieldName = parser.getCurrentName();
				current = parser.nextToken();
				if ("name".equals(fieldName)) {
					user.setName(parser.getText());
				}
			}

			return user;
		} catch (final Exception e) {
			throw new UserRetrievalException("Unable to parse user data for " + getUsername(), e);
		} finally {
			post.releaseConnection();
			IOUtils.closeQuietly(inputStream);
			IOUtils.closeQuietly(outputStream);
		}
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
