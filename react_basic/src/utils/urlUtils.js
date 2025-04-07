const urlUtils = {
  changeQuery(params) {
    const url = new URL(location.href);
    const seacrhParams = url.searchParams;

    for (const param in params) {
      const operation = params[param].operation;

      switch (operation) {
        case 'set':
          seacrhParams.set(param, params[param].value);
          break;
        case 'delete':
          seacrhParams.delete(param);
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    }

    seacrhParams.sort();
    history.pushState('', '', url);
  },
};

export default urlUtils;
