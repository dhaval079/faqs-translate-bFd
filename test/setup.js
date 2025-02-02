// test/setup.js
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

chai.use(chaiHttp);
chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;
global.__filename = __filename;
global.__dirname = __dirname;