import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private myHttpClient: HttpClient) { }

  login(data: any) {
    return this.myHttpClient.post(environment.BaseUrl + "/api/Authenticate/login", data)
  }

  isLogedIn() {
    return localStorage.length > 0;
  }

  getToken() {
    let token = this.getValueByKey('token')
    return token
  }

  setValueWithExpire(key: string, data: any, expiedIn: any) {
    let x = { data: data, expire: this.handelExpiredDate(expiedIn) }
    localStorage.setItem(key, JSON.stringify(x))
  }

  getValueByKey(key: string) {
    let storedData = localStorage.getItem(key)
    if (storedData) {
      let parsedData = JSON.parse(storedData)
      if (new Date(parsedData.expire) >= new Date()) {
        return parsedData.data
      }
      else {
        localStorage.clear()
        return null
      }
    }
    else {
      return null
    }
  }


  handelExpiredDate(data: any) {
    data = data.split('T')
    let time = (data[1].split('Z'))[0]
    let date = { 'y': data[0].split('-')[0], 'm': data[0].split('-')[1], 'd': data[0].split('-')[2] }
    time = { 'H': data[1].split(':')[0], 'M': data[1].split(':')[1], 'S': (data[1].split(':')[2]).split('Z')[0] }
    let EX = new Date(date.y, parseInt(date.m) - 1, date.d, time.H, time.M, time.S)
    return EX.toString()
  }


}
