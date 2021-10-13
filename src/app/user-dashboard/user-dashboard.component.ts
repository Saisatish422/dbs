import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { ApiService } from '../shared/api.service';
import { UserModel } from "./user-dashboard.model";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  formValue !: FormGroup;
  userModelObj : UserModel = new UserModel();
  userData !: any;
  showAdd!: boolean;
  showUpdate!: boolean;
  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue=this.formbuilder.group({
        name : ['', [Validators.required, Validators.minLength(3)]],
        email : ['', [Validators.required]],
        phone : ['', [Validators.required]],
        website : ['']
      })
      this.getAllUsers();
  }

  clickAddUser(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postUserDetails(){
    this.userModelObj.name = this.formValue.value.name;
    this.userModelObj.email = this.formValue.value.email;
    this.userModelObj.phone = this.formValue.value.phone;
    this.userModelObj.website = this.formValue.value.website;

    this.api.postUser(this.userModelObj)
      .subscribe(res=>{
        console.log(res);
        alert("User added successfully.")
        let ref=document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
        this.getAllUsers();
      },
      err=>{
        alert("something missing");
      })
  }
  getAllUsers(){
    this.api.getUser(this.userData)
    .subscribe(res=>{
      this.userData = res;
    })
  }
  deleteUser(user: any){
    this.api.deleteUser(user.id)
    .subscribe(res=>{
      alert("User deleted");
      this.getAllUsers();
    })
  }
  editUser(user: any){
    this.showAdd = false;
    this.showUpdate = true;
    this.userModelObj.id=user.id;
    this.formValue.controls['name'].setValue(user.name);
    this.formValue.controls['email'].setValue(user.email);
    this.formValue.controls['phone'].setValue(user.phone);
    this.formValue.controls['website'].setValue(user.website);
  }
  updateUserDetails(){
    this.userModelObj.name = this.formValue.value.name;
    this.userModelObj.email = this.formValue.value.email;
    this.userModelObj.phone = this.formValue.value.phone;
    this.userModelObj.website = this.formValue.value.website;

    this.api.updateUser(this.userModelObj, this.userModelObj.id)
    .subscribe(res=>{
      alert("updated successfully.");
      let ref=document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllUsers();
    })
  }
}
