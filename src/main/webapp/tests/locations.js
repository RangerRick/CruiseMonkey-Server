module("Locations", {
});

test('testLocations', 4, function() {
	"use strict";
	var location = new Loc(2, 'Shoe Store (Awesome!)', 'store');

	equal(location.deck(), 2);
	equal(location.name(), 'Shoe Store (Awesome!)');
	equal(location.type(), 'store');
	equal(location.id(), '2-ShoeStoreAwesome');
});

test('testLocationWithDescription', 6, function() {
	"use strict";
	var location = new LocationWithDescription(2, 'Shoe Store', 'store', 'Al Bundy works here.');
	var location2 = new LocationWithDescription(3, 'Hat Store', 'store', 'They sell hats!');

	equal(location.deck(), 2);
	equal(location.name(), 'Shoe Store');
	equal(location.type(), 'store');
	equal(location.description(), 'Al Bundy works here.');
	
	equal(location2.deck(), 3);
	equal(location2.name(), 'Hat Store');
});

test('testVenue', 4, function() {
	"use strict";
	var location = new Venue(2, 'Arcadia Theater', '2nd-deck theater.');

	equal(location.deck(), 2);
	equal(location.name(), 'Arcadia Theater');
	equal(location.type(), 'Venue');
	equal(location.description(), '2nd-deck theater.');
});

test('testDecks', 3, function() {
	"use strict";
	var deck = new Deck(2);
	equal(deck.number(), 2);
	deck.size(600);
	equal(deck.image(), 'images/deck02-600.png');
	
	deck.size(300);
	equal(deck.image(), 'images/deck02-300.png');
});
