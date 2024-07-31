package utils

import (
    "time"
    "fmt"
    "os"
    "errors"
    jwt "github.com/golang-jwt/jwt/v5")

    var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

type Claims struct {
    Username string `json:"username"`
    jwt.RegisteredClaims
}


func GenerateJWT(username string) (string, error) {
    expirationTime := time.Now().Add(24 * time.Hour) // Token valid for 24 hours
    claims := &Claims{
        Username: username,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(expirationTime),
        },
    }


    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtKey)
}
func ValidateJWT(tokenString string) (*Claims, error) {
    claims := &Claims{}
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })

    if err != nil {
        fmt.Println("Token validation error:", err)
        return nil, err
    }

    if !token.Valid {
        return nil, errors.New("invalid token")
    }

    return claims, nil
}
