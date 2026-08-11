// Minimal fake req/res for calling Express controller handlers directly,
// without spinning up a real HTTP server.
function mockRes() {
  const res = {};
  res.statusCode = 200;
  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn((body) => {
    res.body = body;
    return res;
  });
  return res;
}

function mockReq({ params = {}, body = {} } = {}) {
  return { params, body };
}

module.exports = { mockRes, mockReq };
