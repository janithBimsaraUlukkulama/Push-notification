import axios from 'axios';

async function regSw () {
  if ('serviceWorker' in navigator) {
    let url = process.env.PUBLIC_URL + '/sw.js';
    const reg = await navigator.serviceWorker.register (url, {scope: '/'});
    console.log ('service config is', {reg});
    return reg;
  }
  throw Error ('serviceworker not supported');
}

async function subscribe (serviceWorkerReg) {
    let subscription = await serviceWorkerReg.pushManager.getSubscription ();
    console.log ({subscription});
    if (subscription === null) {
      subscription = await serviceWorkerReg.pushManager.subscribe ({
        userVisibleOnly: true,
        applicationServerKey: 'BMmUBp44psSvxnQJNvSBGk3RaPvxJzek6Fd4szj1iHoirVCcb6o5zmZTrqTqX5uf20IBzulAKvSa7l38cI7e8Lg',
      });
    }
    axios.post ('http://localhost:9000/subscribe', subscription);
  }

  export {regSw, subscribe};