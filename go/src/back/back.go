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
    router.HandleFunc("/data", getLocationData)
    router.HandleFunc("/data/{filename}", getLocationDataByDate)

    log.Fatal(http.ListenAndServe(":8080", router))
}

func Index(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    fmt.Fprintf(w, "Welcome to the rubylion API")
}

func getPageNames(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
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
    w.Header().Set("Access-Control-Allow-Origin", "*")
    vars := mux.Vars(r)
    files, _ := ioutil.ReadDir("pages")

    for _, f := range files {
        if f.Name() == vars["pageName"] {

            log.Printf("%s", "pages/" + f.Name())

            if page, err := ioutil.ReadFile("pages/" + f.Name()); err == nil {
                log.Printf("%s", string(page))
                if err := json.NewEncoder(w).Encode(string(page)); err != nil {
                    panic(err)
                }
            }
        }
    }
}

func getLocationData(w http.ResponseWriter, r *http.Request){
    w.Header().Set("Access-Control-Allow-Origin", "*")
    var names []string
    files, _ := ioutil.ReadDir("./data")
    for _, f := range files {
        names = append(names, f.Name())
    }

    log.Printf("%s", names)

    if err := json.NewEncoder(w).Encode(names); err != nil {
        panic(err)
    }
}

func getLocationDataByDate(w http.ResponseWriter, r *http.Request){
    w.Header().Set("Access-Control-Allow-Origin", "*")
    vars := mux.Vars(r)
    files, _ := ioutil.ReadDir("./data")

    for _, f := range files {
        if f.Name() == vars["filename"] {

            log.Printf("%s", "data/" + f.Name())

            if data, err := ioutil.ReadFile("data/" + f.Name()); err == nil {
                log.Printf("%s", string(data))
                if err := json.NewEncoder(w).Encode(string(data)); err != nil {
                    panic(err)
                }
            }
        }
    }
}