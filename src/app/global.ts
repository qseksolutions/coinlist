export const header = '';
export const base_url = 'http://localhost:4200/';
export const api_url = 'http://api.coinlisting.io:3000/v1/';

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

export const cointrackbyuserAPI = 'cointrackbyuser';

export const login_ses = localStorage.getItem('login_ses');
export const userid = localStorage.getItem('id');
export const useremail = localStorage.getItem('email');
export const username = localStorage.getItem('name');
export const usertype = localStorage.getItem('usertype');
export const userstatus = localStorage.getItem('status');
export const basecurr = localStorage.getItem('base');
export const base_sing = localStorage.getItem('base_sing');
export const user_base = localStorage.getItem('user_base');
const purl = window.location.href;
if (purl === base_url) {
    this.srton = localStorage.getItem('sorton');
    this.srtby = localStorage.getItem('sortby');
} else {
    this.srton = localStorage.setItem('sorton', null);
    this.srtby = localStorage.setItem('sortby', null);
}
export const sorton = this.srton;
export const sortby = this.srtby;
