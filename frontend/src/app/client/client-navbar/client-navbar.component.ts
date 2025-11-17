import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.css']
})
export class ClientNavbarComponent implements OnInit {
  isLoggedIn:any={
    SA:false,
    Admin:false
  }
  constructor(private authService:AuthService){}
  ngOnInit(): void {
    this.getLoggedInInfo();
  }

  getLoggedInInfo = () =>{
    let token:any = this.authService.getDecodedToken();
    console.log("TOKEN==>",token);
    if(token){
      if(token?.role=='sa'){
        this.isLoggedIn.SA=true;
      }
      if(token?.role=='admin'){
        this.isLoggedIn.Admin=true;
      }
    }
  }
}
