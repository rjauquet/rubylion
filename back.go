package main

import (
    "fmt"
    "net/http"
    "io/ioutil"
)

func handler(w http.ResponseWriter, r *http.Request) {


    if(r.URL.Path[1:] == ""){

    }


    files, _ := ioutil.ReadDir("pages/")

    for _, f := range files {
        fmt.Fprintf(w, "%s\n", f.Name())
    }
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}