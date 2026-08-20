const { getStreamingServers } = require('./src/services/providerAggregator.js');
const { fetchSinewixSources } = require('./src/services/sinewixScraper.js');
const { fetchDiziBalSources } = require('./src/services/diziBalScraper.js');
const { fetchFilmEkseniSources } = require('./src/services/filmekseniScraper.js');
const { fetchHDFilmizleSources } = require('./src/services/hdfilmizleScraper.js');
const { fetchFilmizlechSources } = require('./src/services/filmizlechScraper.js');
const { fetchDizipalSources } = require('./src/services/dizipalScraper.js');

// Test each individually
async function run() {
  console.log('Testing Esaretin Bedeli across all scrapers...');
}
run();
