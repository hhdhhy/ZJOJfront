import axios from "axios";

class Http { 
    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_BASE_URL,
            timeout: 6000,
        });
    }
    post(path,data){
        return this.instance.post(path,data);
    }

    get(path,data){ 
        return this.instance.get(path,data);
    }
}


export default new Http()