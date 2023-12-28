export class DBProgress{

    generateStudentId(){
        return new Promise ((resolve,reject) =>{
            const http = new XMLHttpRequest();
            http.onreadystatechange = () => {
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        resolve(http.responseText);
                    }else{
                        reject(new Error(`HTTP request failed with status ${http.status}`));
                    }
                }
            }

            http.open("GET","http://localhost:8080/page/student?action=getLastStudentId",true);
            http.send();

        });
        
    }

}