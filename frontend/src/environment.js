let IS_PROD=true;
const servers=IS_PROD?
    "http://localhost:8000" :
    "https://annabridgebackened.onrender.com"

export default server;