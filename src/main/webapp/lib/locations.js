/**
 * @constructor
 * @param {number} deck
 * @param {String|string} name
 * @param {String|string} type
 */
function Loc(deck, name, type) {
	'use strict';
	var self = this;

	self.deck = ko.observable(deck);
	self.name = ko.observable(name);
	self.type = ko.observable(type);
	self.id = ko.computed(function _computedId() {
		var retval = self.deck() + '-' + self.name();
		return retval.replace(self.alnumRegex, '');
	});
}
Loc.prototype.alnumRegex = /[^A-Za-z0-9\-]/g;

/**
 * @constructor
 * @param {number} deck
 * @param {String|string} name
 * @param {String|string} type
 * @param {String|string=} description
 */
function LocationWithDescription(deck, name, type, description) {
	'use strict';
	var self = this;
	$.extend(self, new Loc(deck, name, type));
	self.description = ko.observable(description);
}

/**
 * @constructor
 * @param {number} deck
 * @param {String|string} name
 * @param {String|string=} description
 */
function Venue(deck, name, description) {
	'use strict';
	var self = this;
	$.extend(self, new LocationWithDescription(deck, name, 'Venue', description));
}

/**
 * @constructor
 * @param {number} deck
 * @param {String|string} name
 * @param {String|string=} description
 */
function Bar(deck, name, description) {
	'use strict';
	var self = this;
	$.extend(self, new LocationWithDescription(deck, name, 'Bar/Club', description));
}

/**
 * @constructor
 * @param {number} deck
 * @param {String|string} name
 * @param {String|string=} description
 */
function Miscellaneous(deck, name, description) {
	'use strict';
	var self = this;
	$.extend(self, new LocationWithDescription(deck, name, 'Miscellaneous', description));
}

/**
 * @constructor
 * @param {number} deck
 * @param {String|string} name
 * @param {String|string=} description
 * @param {number=} surcharge
 */
function Food(deck, name, description, surcharge) {
	'use strict';
	var self = this;
	$.extend(self, new LocationWithDescription(deck, name, 'Food', description));
	self.surcharge = ko.observable(surcharge);
}

/**
 * @constructor
 * @param {number} deck
 * @param {String|string} name
 * @param {String|string=} description
 */
function Shopping(deck, name, description) {
	'use strict';
	var self = this;
	$.extend(self, new LocationWithDescription(deck, name, 'Shopping', description));
}

/**
 * @constructor
 * @param {number} deck
 * @param {String|string} name
 * @param {String|string=} description
 */
function Pool(deck, name, description) {
	'use strict';
	var self = this;
	$.extend(self, new LocationWithDescription(deck, name, 'Pool', description));
}

/**
 * @constructor
 * @param {number} deck
 * @param {String|string} name
 * @param {String|string=} description
 */
function Fitness(deck, name, description) {
	'use strict';
	var self = this;
	$.extend(self, new LocationWithDescription(deck, name, 'Spa/Fitness', description));
}

var locations = [
	new Venue(2, 'Arcadia Theatre (2nd Deck)', 'Our theatre - five stories from the orchestra pit to domed ceiling - features contemporary musical stage productions.'),
	new Venue(2, 'Conference Center', 'Our comfortable conference center features state-of-the-art presentation equipment and a variety of meeting rooms.'),
	new Miscellaneous(2, 'Center Ice Rink', 'Inside Studio B, the ice rink offers skating as well as ice shows.'),
	new Venue(2, 'Studio B (2nd Deck)', 'A multipurpose studio complex filled with activity all day long, from ice-skating to cooking demonstrations.'),
	new Venue(3, 'Arcadia Theatre (3rd Deck)', 'Our theatre - five stories from the orchestra pit to domed ceiling - features contemporary musical stage productions.'),
	new Bar(3, 'The Crypt (3rd Deck)', 'The Crypt\'s decor is true to its name: the area features spiked window frames, paintings of fantasy warriors, pictures of people from the dark ages, and gargoyle statues. The bar stools are pointed, the railings look like a part of an ancient church, and even the lights look like torches. Along the walls are armchairs and small glass tables. The club is two levels high and the dance floor is on the lower level so people upstairs can watch the action below. both bars, upstairs and downstairs, are made of chrome and milky glass with lights. The Crypt opens around 8pm for teen and kid\'s parties, but it is open for adults only later in the evening.'),
	new Venue(3, 'Studio B (3rd Deck)', 'A multipurpose studio complex filled with activity all day long, from ice-skating to cooking demonstrations.'),
	new Bar(3, 'On Air', 'Grab a microphone and get to singing! This karaoke club will provide hours of endless entertainment; sing the classics or watch your friends embarrass themselves on stage! It\'s a win-win situation at On Air Club.'),
	new Miscellaneous(3, 'RCTV', 'RCTV is the television/internet/communications control room.  Look through the glass to see the master control for the entire ship.'),
	new Miscellaneous(3, 'Art Gallery', 'Original art is displayed in the onboard art gallery as well as throughout the ship. To purchase something for your own collection, visit an onboard art auction.'),
	new Miscellaneous(3, 'Terra', 'A dining room area used for overflow, or as a meeting room.'),
	new Miscellaneous(3, 'Cielo', 'A dining room area used for overflow, or as a meeting room.'),
	new Food(3, 'Leonardo Dining Room', 'Our three-tier dining room features a wide variety of menu items and impeccable service.'),
	new Venue(4, 'Arcadia Theatre (4th Deck)', 'Our theatre - five stories from the orchestra pit to domed ceiling - features contemporary musical stage productions.'),
	new Bar(4, 'The Crypt (4th Deck)', 'The Crypt\'s decor is true to its name: the area features spiked window frames, paintings of fantasy warriors, pictures of people from the dark ages, and gargoyle statues. The bar stools are pointed, the railings look like a part of an ancient church, and even the lights look like torches. Along the walls are armchairs and small glass tables. The club is two levels high and the dance floor is on the lower level so people upstairs can watch the action below. both bars, upstairs and downstairs, are made of chrome and milky glass with lights. The Crypt opens around 8pm for teen and kid\'s parties, but it is open for adults only later in the evening.'),
	new Bar(4, 'Schooner Bar', 'This nautically themed bar is the perfect spot to enjoy a drink with friends.'),
	new Miscellaneous(4, 'Casino Royale', 'Our glittering casino features electronic Slot Machines, Video Poker, Blackjack, Craps, Roulette and Caribbean Stud Poker.'),
	new Shopping(4, 'Photo Gallery and Shop', 'View and purchase photos of your family that Royal Caribbean\'s staff has taken on board and in port! You can also purchase a dvd of the photos as well to show off what a great time you had to all your friends and family back home.'),
	new Bar(4, 'Boleros Lounge', 'Follow the Latin beat and find yourself in a nighttime hot spot where you can keep up with live music and cool down n with a mojito or caipirinha.'),
	new Food(4, 'Isaac Dining Room', 'Our three-tier dining room features a wide variety of menu items and impeccable service.'),
	new Miscellaneous(5, 'Observation Deck', 'A wind-blown perch where you\'ll have views and photo-ops of "titanic" proportions.'),
	new Miscellaneous(5, 'Outdoor Deck'),
	new Venue(5, 'Pharaoh\'s Palace', 'Enjoy live music, cocktails, and fun, exciting trivia games in this lounge. Pharaoh\'s Palace has kitschy Egyptian décor including sarcophaguses and sphinx statues! Check your Cruise Compass and Daily Planner for more information on performances and games.'),
	new Bar(5, 'Connoisseur Club', 'A classic cigar lounge in the style of a modern gentleman\'s club, the connoisseur club is a great place to have a smoke and a cocktail.'),
	new Food(5, 'Sorrento\'s', 'When you find yourself craving pizza, drop by Sorrento\'s for a piping hot slice.'),
	new Bar(5, 'Bull and Bear Pub', 'The ship\'s version of an English pub, The Bull and Bear is located centrally on deck five, featuring vintage wooden décor to give a friendly vibe while you relax with a drink or have a quick snack.'),
	new Shopping(5, 'Promenade Shops', 'Distinctive storefronts offer an array of merchandise ranging from logo items, perfume and jewelry to liquor and cruise wear.'),
	new Bar(5, 'Vintages', 'A classic wine and tapas bar with an extensive list of wines from worldwide. Guests may also participate in wine tastings and classes – check your Cruise Compass and Daily Planner for exact times.'),
	new Shopping(5, 'Royal Promenade', 'This boulevard centrally located on deck five is ship\'s version of 5th avenue – full of a variety of shops and restaurants.'),
	new Food(5, 'Ben and Jerry\'s Ice Cream Parlor', 'Satisfy your sweet tooth with a smoothie or a waffle cone of various flavors of Ben and Jerry\'s rich ice cream!'),
	new Food(5, 'Café Promenade', 'A strip of the Royal promenade specifically designated for in between meal snacking with additional seating.'),
	new Food(5, 'Cupcake Cupboard', 'Have some fun and grab a cupcake before, after, or in between meals at the Cupcake Cupboard! With specialty flavors such as bubblegum, red velvet, and even root beer – there\'s a featured flavor each day of the trip! Guests can also participate in cupcake making and decorating classes!'),
	new Shopping(5, 'Britto Art Gallery', 'The spirited works of iconic pop artist Romero Britto saturate this engaging and interactive space, where shoppers may peruse a wide array of artwork, giftware, collectibles and luggage, including limited edition custom works created by Britto exclusively for Royal Caribbean guests.'),
	new Miscellaneous(5, 'Guest Relations', 'The place to go for general ship information, to report lost or damaged goods, to exchange money or cash traveler\'s checks.'),
	new Miscellaneous(5, 'Explorations!', 'Book your shore excursions at the Explorations! Desk.'),
	new Bar(5, 'Champagne Bar', 'A classic lounge-inspired bar that has an air of elegance where you can satisfy yourself with a glass of bubbly to celebrate a great vacation.'),
	new Food(5, 'Galileo Dining Room', 'Our three-tier dining room features a wide variety of menu items and impeccable service.'),
	new Miscellaneous(6, 'Business Services', 'Computers for browsing the Internet and complimentary printing are available to meet your business needs.'),
	new Miscellaneous(7, 'Library', 'Our onboard library features comfortable reading chairs as well as an impressive selection of books and guidebooks.'),
	new Miscellaneous(8, 'Royal Caribbean Online', 'It\'s high tech on the high seas! With royalcaribbean online, for a small fee you can access the Internet, send e-mails, or send your family an e-postcard with your picture in it.'),
	new Bar(10, 'Concierge Club', 'Only accessible to those who have booked the larger suites, the concierge club gives extra leisure to guests in a semi-exclusive lounge.'),
	new Fitness(11, 'Vitality at Sea Spa and Fitness Center', 'Our seaside fitness center features modern exercise equipment. And our full-service spa offers a beauty salon and spa treatments, including massage, manicures and seaweed body wraps.'),
	new Pool(11, 'Solarium', 'Escape the general pool population and head to the Solarium to bask in the more relaxed adults only swimming pool and cantilevered whirlpools. Encompassed by glass the clean, contemporary design provides a perfect area for sunbathing and swimming.'),
	new Pool(11, 'Whirlpool'),
	new Bar(11, 'Pool Bar', 'Throw back a few drinks after swimming in the main pool or take one to your deck chair while you soak up some sun.'),
	new Pool(11, 'Main Pool', 'Salt-water pool for guests to enjoy twenty-four hours a day.'),
	new Pool(11, 'Sports Pool', 'A salt-water pool designated for water sports, join in on a game of volleyball or a class of water aerobics. Lap swim times are also available but are subject to change – check your Cruise Compass and Daily Planner.'),
	new Pool(11, 'H2O Zone', 'A bright, colorful water play area, H2O Zone is where your kids will want to be the entire trip! Water spigots, sprinklers, geysers, and even water cannons!  At night this area turns into a beautifully lit sculpture garden.'),
	new Bar(11, 'Squeeze', 'Quench your thirst after swimming laps on the pool deck at Squeeze. This juice bar has a variety of fruit juices, wheat grass shots, and energy shakes!'),
	new Shopping(11, 'SeaTrek Dive Shop', 'Whether you\'re a seasoned pro or a beginner, you can rent gear and take courses at this shop to properly prepare yourself for any scuba excursions you plan to go on during your vacation. Full PADI certificate courses available as well as tune up refresher courses.'),
	new Food(11, 'Chops Grille', 'Royal\'s signature upscale steak house, Chops Grille provides a palatable dinner with a classic menu. Have a fresh salad and juicy steak followed by a delectable slice of chocolate mud pie.', 25.00),
	new Food(11, 'Portofino', 'A classic, intimate Italian restaurant where you can feed upon some of the finest pastas, soups, and salads on board. Finish the night off by sharing a slice of scrumptious tiramisu with a glass of fine wine.', 20.00),
	new Bar(11, 'Plaza Bar', 'Cocktail bar in the middle of deck eleven conveniently sandwiched between several other dining options.'),
	new Food(11, 'Windjammer Café', 'Casual buffet style dining, a popular choice among guests. Open for several meals a day, guests can satisfy any craving they come across during their trip.'),
	new Fitness(12, 'Vitality at Sea Spa and Fitness Center', 'Our seaside fitness center features modern exercise equipment. And our full-service spa offers a beauty salon and spa treatments, including massage, manicures and seaweed body wraps.'),
	new Bar(12, 'Sky Bar', 'Catch a drink in the sun at this small ocean blue bar and people watch from plush white stools.'),
	new Fitness(12, 'Jogging Track', 'Run laps while taking in the view. Our tracks are open to anyone and proper shoes are recommended.'),
	new Miscellaneous(12, 'Outdoor Movie Screen', 'Watch first-run movies and big time sporting events the way they were meant to be seen - poolside, under the stars. A screen hoisted above the main pool area will showcase all the larger-than-life action.'),
	new Miscellaneous(12, 'Royal Babies and Tots Nursery', 'Parents love our new colorful nursery where our littlest guests can be left in the care of our trained professionals, to enjoy specially-designed programming and playgroups designed by Fisher-Price and Crayola.'),
	new Miscellaneous(12, 'The Living Room', 'A laid-back place for teens to hang out with new friends.'),
	new Miscellaneous(12, 'Video Arcade', 'Blips, bleeps, clangs and cheers. Play to win in a classic arcade atmosphere with timeless games like Pacman and table hockey, plus the latest – Guitar Hero, Fast and Furious Drift and more.'),
	new Miscellaneous(12, 'Adventure Ocean', 'A play area with specially designed activities for kids ages 3-17. Run by exceptional, energetic, college-educated staff.'),
	new Food(12, 'Johnny Rockets', 'Step into our \'50s diner, which features red naugahyde booths, formica counters, a jukebox, burgers, fries and, of course, good old-fashioned malted milk shakes.'),
	new Miscellaneous(12, 'Fuel Teen Disco', 'A teens-only club where they can gather, dance and enjoy music.'),
	new Miscellaneous(13, 'Rock Climbing Wall', 'This is the largest of our rock-climbing walls: a 43-foot-tall by 44-foot-wide freestanding wall with a central spire. Plus, with eleven different routes to choose from, our rock-climbing wall offers skill combinations for all levels.'),
	new Fitness(13, 'Sports Court', 'An outdoor full-size court for sports, including basketball and volleyball.'),
	new Miscellaneous(13, 'Golf Simulator', 'Being at sea making you miss the green? The golf simulator can give golf pros their fix until they reach land!'),
	new Miscellaneous(13, 'Freedom Fairways', 'A nine-hole miniature golf course with whimsical shrubbery and lighting open 24 hours for the entire family to enjoy at any time they please.'),
	new Miscellaneous(13, 'Wipe Out! Café', 'Grab a bite to eat at this casual café on the pool deck while you watch people wipe out on their surf boards at the FlowRider station.'),
	new Pool(13, 'FlowRider Surfing', 'Your friends are never going to believe you surfed onboard a ship! Even the best beaches have bad days, but on the FlowRider, surf\'s always up. Plus, the FlowRider is great fun for all ages and all skill levels, whether you\'re boogie boarding or surfing.'),
	new Bar(14, 'Olive or Twist', 'A classic martini bar encompassed by floor to ceiling windows for great panoramic views. Live music also occurs nightly here.'),
	new Miscellaneous(14, 'Cloud Nine', 'A quiet space to work and have meetings, Cloud Nine is a multipurpose room that is often used as a reception area for weddings on the ship.'),
	new Miscellaneous(14, 'Seven Hearts', 'A small room dedicated for the fun of playing card games – separate from the casino on a lower deck. Seven Hearts boasts classic felt tables and board games in addition to cards.'),
	new Bar(14, 'Viking Crown Lounge', 'A Royal Caribbean signature. Perched high above the ocean, this comfortable lounge offers spectacular vistas by day and turns into a lively dance club at night.'),
	new Bar(14, 'Diamond Club', 'Diamond, Diamond Plus, and Pinnacle Club Crown and Anchor Society members enjoy access to this lounge, created to serve these loyal guests with concierge access, complimentary continental breakfast, and evening drinks.'),
	new Miscellaneous(15, 'Skylight Chapel', 'Our wedding chapel, which can accommodate 40 people, is located on top of the Viking Crown Lounge (the highest point on the ship), and is the perfect place to say "I do."')
];

(function _uniqueEnclosure($) {
	'use strict';
	var _old = $.unique;

	$.unique = function _unique(arr) {
		'use strict';
		// do the default behavior only if we got an array of elements
		if (!!arr[0].nodeType) {
			return _old.apply(this, arguments);
		} else {
			// reduce the array to contain no dupes via grep/inArray
			return $.grep(arr, function _grep(v, k) {
				'use strict';
				return $.inArray(v, arr) === k;
			});
		}
	};
})(jQuery);

/**
 * @constructor
 */
function AmenitiesModel() {
	'use strict';
	var self = this;
	self.amenities = ko.observableArray(locations);
	self.filter = ko.observable('');

	self.filteredAmenities = ko.computed(function _computedFilteredAmenities() {
		'use strict';
		var filter = self.filter().toLowerCase();

		if (!filter) {
			return self.amenities();
		} else {
			return ko.utils.arrayFilter(self.amenities(), function _amenitiesArrayFilter(amenity) {
				if (amenity.name && amenity.name() && amenity.name().toLowerCase().search(filter) != -1) {
					return true;
				} else if (amenity.description && amenity.description() && amenity.description().toLowerCase().search(filter) != -1) {
					return true;
				}
				return false;
			});
		}
	});

	self.orderedAmenities = ko.computed(function _computedOrderedAmenities() {
		'use strict';
		var filteredAmenities = self.filteredAmenities(),
		orderLeft, orderRight,
		amenities;
		/*
		rawCategories = $.map(filteredAmenities, function _rawCategories(entry, index) {
			'use strict';
			return entry.deck();
		});

		rawCategories = $.unique(rawCategories).sort(function _sortRawCategories(left, right) {
			'use strict';
			return (left == right)? 0 : (left < right ? -1 : 1);
		});
		*/

		amenities = self.filteredAmenities().sort(function _sortedFilteredAmenities(left, right) {
			'use strict';
			// first, order by deck
			orderLeft = left.deck();
			orderRight = right.deck();
			if (orderLeft != orderRight) {
				return ((orderLeft < orderRight) ? -1 : 1);
			}

			// on the same deck, order by name
			orderLeft = left.name();
			orderRight = right.name();
			return ((orderLeft == orderRight) ? 0 : ((orderLeft < orderRight) ? -1 : 1));
		});

		var lastDeck, currentDeck, currentAmenity, deckObject, ret = [];

		for (var i = 0; i < amenities.length; i++) {
			currentAmenity = amenities[i];
			currentDeck = currentAmenity.deck();
			if (currentDeck != lastDeck) {
				if (deckObject) {
					ret.push(deckObject);
				}
				lastDeck = currentDeck;
				deckObject = {
					number: currentDeck,
					amenities: []
				};
			}
			deckObject.amenities.push(currentAmenity);
		}
		ret.push(deckObject);

		// console.log('ret = ' + ko.toJSON(ret));

		return ret;
	});
}

var amenitiesModel = new AmenitiesModel();

Number.prototype.pad = function _pad(size) {
	'use strict';
	return (1e15 + this + '').slice(-size);
};

/**
 * @constructor
 */
function Deck(number) {
	'use strict';
	var self = this;
	self.number = ko.observable(number);
	self.size = ko.observable(600);
	self.id = ko.computed(function _computedId() {
		'use strict';
		return 'deck-' + self.number();
	});
	self.image = ko.computed(function _computedImage() {
		'use strict';
		return 'images/deck' + self.number().pad(2) + '-' + self.size() + '.png';
	});
}

/**
 * @constructor
 */
function DecksModel() {
	'use strict';
	var self = this;

	self.decks = ko.observableArray();

	for (var i = 2; i <= 15; i++) {
		self.decks.push(new Deck(i));
	}
}

var decksModel = new DecksModel();
