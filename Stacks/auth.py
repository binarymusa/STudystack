from flask import Blueprint, render_template, redirect, url_for, flash, request,session
from flask_login import login_user, logout_user, login_required, current_user
from .models import User
from . import db
import re
from sqlalchemy import or_, and_
# from .forms import LoginForm, RegistrationForm

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login_page():
   if request.method == 'POST':
      email = request.form.get('email')
      password = request.form.get('password')

      print(f"Email: {email}")
      print(f"Password: {password}\n")
      # username = request.form['username']
      # password = request.form['password']
      try:
         check_user = User.query.filter_by(email=email).first()
         # Test = (check_user == email)
         # print(Test)

         if check_user and check_user.check_password_correction(attempted_password=password):
            login_user(check_user) 

            #  Access the associated role object via the role relationship
            if check_user.role and check_user.role.role_name == 'Admin':
               flash(f'Admin Login successful', category='success')
               return redirect(url_for('admin_welcome'))
            else:
               flash(f'Login successful', category='success')
               return redirect(url_for('study.index'))
         else:
            flash(f'Incorrect username or Password', category='danger')
            return redirect(url_for('auth.login_page'))
      except :
         flash(f'An error occurred!', category='danger')
         # return redirect(url_for('auth.login_page'))

   return render_template('login.html')

   """ else:
      user_id = session.get('user_id')
      if user_id:
         # User is logged in
         check_user = User.query.get(user_id)
         if check_user and check_user.role and check_user.role.role_name == 'Admin':
            return redirect(url_for('admin_welcome'))
         else:
            return redirect(url_for('welcome_page')) """
     

@auth.route('/signup' , methods=['GET', 'POST'])
def signup_page():
   if request.method == 'POST':
      username = request.form.get('username')
      email = request.form.get('email')
      password = request.form.get('password')

      # username = request.form['username']
      # email = request.form['email']
      # password = request.form['password']
         
      existing_user = User.query.filter(and_(User.username == username , User.email == email)).first()
      
      if existing_user:
         flash(f'User already exists. Try different credentials', category='danger')
         return redirect(url_for('auth.signup_page'))
      else: 
         reg_exp = '^\S+(\@gmail\.com$|\@hotmail\.com$|\@yahoo\.com$)$'
         try:
            if (not(re.search(reg_exp, email))):
               flash('Invalid email address!', category='danger')
               return redirect(url_for('auth.signup_page'))
            else:
               # return True
               print(email)           
               new_user = User(username=username, email=email, password=password)
               db.session.add(new_user)
               db.session.commit()

               login_user(new_user)
               flash(f'signup successful', category='success') 
               return redirect(url_for('study.index'))     
         except:
            flash('an error occured', category='danger')

      return render_template('signup.html')
   else:
      return render_template('signup.html')
   
@auth.route('/pswdreset', methods=['GET', 'POST'])
def pswd_rst():
   if request.method == 'POST':
      email = request.form['email']

      if current_user.id and email:
         pass

   
@auth.route('/logout')
@login_required
def logout():
   logout_user()
   return redirect(url_for('auth.login_page'))