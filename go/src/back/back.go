package main

import (
    "fmt"
    "log"
    "net/http"
    "io/ioutil"
    "encoding/json"

    "github.com/gorilla/mux"
)

type Page struct {
    Text string
}

func main() {

    router := mux.NewRouter().StrictSlash(true)
    router.HandleFunc("/", Index)
    router.HandleFunc("/pages", getPageNames)
    router.HandleFunc("/page/{pageName}", getPageByName)

    log.Fatal(http.ListenAndServe(":8080", router))
}

func Index(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome to the rubylion API")
}

func getPageNames(w http.ResponseWriter, r *http.Request) {
    var names []string
    files, _ := ioutil.ReadDir("./pages")
    for _, f := range files {
        names = append(names, f.Name())
    }

    log.Printf("%s", names)

    if err := json.NewEncoder(w).Encode(names); err != nil {
        panic(err)
    }
}

func getPageByName(w http.ResponseWriter, r *http.Request) {
    files, _ := ioutil.ReadDir("./pages")
    for _, f := range files {
        if f.name() == r.pageName {
            log.Printf("%s", r.pageName)
            if err := json.NewEncoder(w).Encode(f); err != nil {
                panic(err)
            }
        } else {
            if err := json.NewEncoder(w).Encode(""); err != nil {
                panic(err)
            }
        }
    }
}