const clients = new Set();

const addClient = (res, user) => {
  const client = { res, user };
  clients.add(client);

  // Initial handshake message
  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ ok: true, user: { id: user.id, role: user.userType } })}\n\n`);

  // Heartbeat to keep connection alive
  client.heartbeat = setInterval(() => {
    try {
      res.write(`event: ping\n`);
      res.write(`data: ${Date.now()}\n\n`);
    } catch (_) {}
  }, 30000);

  return client;
};

const removeClient = (res) => {
  for (const client of clients) {
    if (client.res === res) {
      clearInterval(client.heartbeat);
      clients.delete(client);
      break;
    }
  }
};

const broadcast = (payload, filterFn) => {
  for (const { res, user } of clients) {
    if (typeof filterFn === 'function' && !filterFn(user)) continue;
    try {
      res.write(`event: message\n`);
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch (_) {}
  }
};

module.exports = { addClient, removeClient, broadcast };


