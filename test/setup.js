const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(chaiHttp);
chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;