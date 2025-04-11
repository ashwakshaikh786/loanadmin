export const isSessionValid = () => {
    const expiry = sessionStorage.getItem('session_expiry');
    if (!expiry || Date.now() > Number(expiry)) {
      sessionStorage.clear();
      return false;
    }
    return true;
  };