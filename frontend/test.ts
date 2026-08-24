import {SetData, AddListener}  from "./src/Global.ts";

AddListener((data)=>{
    console.log(`Got of size ${data.length}`)
})

SetData([1,2,3,4,5])