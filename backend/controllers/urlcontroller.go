package controllers

import (
    "encoding/json"
    "net/http"
    "net/url"
    "strings"
	"fmt"
)

type URLRequest struct {
    URL      string `json:"url"`
    Operation string `json:"operation"`
}

type URLResponse struct {
    ProcessedURL string `json:"processed_url"`
}

func RedirectURL(originURL string) (string, error) {
    u, err := url.Parse(originURL)
    if err != nil {
        return "", err
    }
    u.Host = "www.byfood.com"
    u.Path = strings.ToLower(u.Path)
    return u.String(), nil
}

func CanonicalURL(originURL string) (string, error) {
    u, err := url.Parse(originURL)
    if err != nil {
        return "", err
    }
    u.RawQuery = ""
    u.Path = strings.TrimRight(u.Path, "/")
    return u.String(), nil
}

func ShortenURL(w http.ResponseWriter, r *http.Request) {
    var op URLRequest

    err := json.NewDecoder(r.Body).Decode(&op)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

	fmt.Println("Processing URL: ", op.URL)
	fmt.Println("Operation: ", op.Operation)
    var response URLResponse	

    switch op.Operation {
    case "redirection":
        responseURL, err := RedirectURL(op.URL)
        if err != nil {
            http.Error(w, "Invalid URL", http.StatusBadRequest)
            return
        }
        response.ProcessedURL = responseURL

    case "canonical":
        responseURL, err := CanonicalURL(op.URL)
        if err != nil {
            http.Error(w, "Invalid URL", http.StatusBadRequest)
            return
        }
        response.ProcessedURL = responseURL

    case "all":
        canonicalURL, err := CanonicalURL(op.URL)
        if err != nil {
            http.Error(w, "Invalid URL", http.StatusBadRequest)
            return
        }
        responseURL, err := RedirectURL(canonicalURL)
        if err != nil {
            http.Error(w, "Invalid URL", http.StatusBadRequest)
            return
        }
        response.ProcessedURL = responseURL

    default:
        http.Error(w, "Invalid operation", http.StatusBadRequest)
        return
    }
    
    err = json.NewEncoder(w).Encode(response)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}
