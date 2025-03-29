from flask import Blueprint, render_template, redirect, url_for, flash, request,session
from flask_login import login_user, logout_user, login_required
from .models import User
from . import db
import re
from sqlalchemy import or_, and_
# from .forms import LoginForm, RegistrationForm

auth = Blueprint('auth', __name__)

@auth.route('/')
@auth.route('/login_page', methods=['GET', 'POST'])
def login_page():
   if request.method == 'POST':
      username = request.form['username']
      password = request.form['password']

      check_user = User.query.filter_by(username=username).first()

      if check_user and check_user.check_password_correction(attempted_password=password):
         login_user(check_user) 
         session['user_id'] = check_user.id 

         #  Access the associated role object via the role relationship
         if check_user.role and check_user.role.role_name == 'Admin':
            flash(f'Admin Login successful', category='success')
            return redirect(url_for('admin_welcome'))
         else:
            flash(f'Login successful', category='success')
            return redirect(url_for('welcome_page'))
      else:
         flash(f'Incorrect username or Password', category='danger')
         return redirect(url_for('login_page'))
  
   else:
      user_id = session.get('user_id')
      if user_id:
         # User is logged in
         check_user = User.query.get(user_id)
         if check_user and check_user.role and check_user.role.role_name == 'Admin':
            return redirect(url_for('admin_welcome'))
         else:
            return redirect(url_for('welcome_page'))
      return render_template('login.html')

@auth.route('/sign_up_page' , methods=['GET', 'POST'])
def signup_page():
   if request.method == 'POST':
      # Get data from the form
      username = request.form['username']
      email = request.form['email']
      password = request.form['password']
         
      existing_user = User.query.filter(and_(User.username == username , User.email_address == email)).first()
      
      if existing_user:
         flash(f'User already exists. Try different credentials', category='danger')
         return redirect(url_for('signup_page'))
      else:
         #checks if the email given matches the expression 
         reg_exp = '^\S+(\@gmail\.com$|\@hotmail\.com$|\@yahoo\.com$)$'
         try:
            if (not(re.search(reg_exp, email))):
               flash('Invalid email address!', category='danger')
               return redirect(url_for('signup_page'))
            else:
               # return True
               print(email)           
               # Add the new user to database
               new_user = User(username=username, email_address=email, password=password)
               db.session.add(new_user)
               db.session.commit()

               login_user(new_user)
               flash(f'signup successful', category='success') 
               return redirect(url_for('welcome_page'))     
         except:
            flash('an error occured', category='danger')

      return render_template('signup.html')
   else:
      return render_template('signup.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))