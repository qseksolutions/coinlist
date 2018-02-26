export const header = '';
export const base_url = 'http://localhost:4200/';
// export const base_url = 'https://coinlisting.io/';
export const api_url = 'https://api.coinlisting.io/v1/';

export const loginAPI = 'login';
export const registerAPI = 'register';
export const userbysocialAPI = 'userbysocial';
export const addtradeAPI = 'addtrade';
export const updatetradeAPI = 'updatetrade';
export const removetradeAPI = 'removetrade';
export const forgotpasswordAPI = 'forgotpassword';
export const profileupdateAPI = 'profileupdate';
export const changepasswordAPI = 'changepassword';
export const addcontactusAPI = 'addcontactus';

export const maincurrencylistAPI = 'maincurrencylist';
export const subcurrencylistAPI = 'subcurrencylist';
export const currencylistAPI = 'currencylist';
export const coinlistAPI = 'coinlist';
export const totalcoinAPI = 'totalcoins';
export const singlecoinAPI = 'coinlist';
export const followlistAPI = 'followlist';
export const getallcoinlistAPI = 'getallcoinlist';
export const portfoliolistAPI = 'portfoliolist';
export const profitlosslistAPI = 'profitlosslist';
export const categorylistAPI = 'categorylist';
export const supportlistAPI = 'supportlist';
export const getprofileupdatedataAPI = 'getprofileupdatedata';
export const getselectcoinpriceAPI = 'getselectcoinprice';
export const getsingleseometaAPI = 'getsingleseometa';
export const gettestseometaAPI = 'gettestseometa';
export const gettradesingledataAPI = 'gettradesingledata';
export const getadvertiseforpageAPI = 'getadvertiseforpage';

export const cointrackbyuserAPI = 'cointrackbyuser';

export const login_ses = localStorage.getItem('login_ses');
export const userid = localStorage.getItem('id');
export const useremail = localStorage.getItem('email');
export const username = localStorage.getItem('name');
export const role = localStorage.getItem('role');
export const usertype = localStorage.getItem('usertype');
export const userstatus = localStorage.getItem('status');
export const basecurr = localStorage.getItem('base');
export const base_sing = localStorage.getItem('base_sing');
export const user_base = localStorage.getItem('user_base');
export const token = localStorage.getItem('token');
const aurl = window.location.href;
const burl = aurl.split('/');
if (burl['3'] !== 'coin' || burl['3'] !== 'followlist' || burl['3'] !== 'portfolio' || burl['3'] !== 'profile') {
    this.srton = localStorage.getItem('sorton');
    this.srtby = localStorage.getItem('sortby');
}
export const sorton = this.srton;
export const sortby = this.srtby;
