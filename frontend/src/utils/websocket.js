// websocket.js
export const getWebSocketUrl = () => {
  // When in development, connect directly to backend
  if (process.env.NODE_ENV === 'development') {
    return `ws://${window.location.hostname}:8000/ws`;
  }
  
  // In production, use the nginx proxy path
  return `ws://${window.location.hostname}/api/ws`;
};

export const createWebSocket = (options = {}) => {
  const {
    onOpen,
    onMessage,
    onError,
    onClose,
    reconnectInterval = 2000
  } = options;

  let ws = null;
  let isIntentionallyClosed = false;

  const connect = () => {
    if (ws) {
      ws.close();
    }

    const url = getWebSocketUrl();
    ws = new WebSocket(url);
    console.log('Connecting to WebSocket at:', url);

    ws.onopen = () => {
      console.log('WebSocket connected successfully');
      if (onOpen) onOpen();
    };

    ws.onmessage = (event) => {
      if (onMessage) onMessage(event);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      if (onClose) onClose();
      
      // Attempt to reconnect after interval unless intentionally closed
      if (!isIntentionallyClosed) {
        setTimeout(connect, reconnectInterval);
      }
    };

    return ws;
  };

  const disconnect = () => {
    isIntentionallyClosed = true;
    if (ws) {
      ws.close();
    }
  };

  return {
    connect,
    disconnect,
    getSocket: () => ws
  };
};
