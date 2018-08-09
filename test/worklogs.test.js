let sinon = require('sinon');
let chai = require('chai');
let { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
const nock = require('nock')
chai.should();

const {td, company_id} = require("./helpers");
const worklogs = td.Worklogs,
    worklogsJson = require("./mocked-responses/worklogs.json");

describe("Worklogs", () => {
    it("GET /worklogs", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${company_id}`)
            .get(function(uri) {
                return uri.indexOf("/worklogs") >= 0;
            })
            .reply(200, worklogsJson);

        let result = await worklogs.get(new Date(worklogsJson.start_time), new Date(worklogsJson.end_time), {limit: 10});

        result.error.should.eq(false);
        result.errorMessage.should.eq(false);
        result.response.should.be.an("object");
        result.response.should.have.property("worklogs");

    });
    it("handles errors", async () => {
        nock(`https://webapi.timedoctor.com/v1.1/companies/${company_id}`)
            .get(function(uri) {
                return uri.indexOf("/worklogs") >= 0;
            })
            .reply(404, "test");

        let result = await worklogs.get(new Date(worklogsJson.start_time), new Date(worklogsJson.end_time), {limit: 10});

        result.error.should.eq(true);
        result.errorMessage.error.should.eq("test");
        (!!result.response).should.eq(false)
    });
});