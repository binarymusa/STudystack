from Stacks import *
from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from .models import User, Topic, Card
from . import db
from datetime import datetime, timedelta
from sqlalchemy import or_, and_
import re


stack = Blueprint('stack', __name__)

stack.route('/')
def index():
    if current_user.is_authenticated:
        topics = Topic.query.filter_by(user_id=current_user.id).all()
        return render_template('index.html', topics=topics)
    return render_template('index.html')

@stack.route('/topic/<int:topic_id>')
@login_required
def view_topic(topic_id):
    topic = Topic.query.get_or_404(topic_id)
    if topic.author != current_user:
        flash('You can only view your own topics!', 'danger')
        return redirect(url_for('stack.index'))
    return render_template('topic.html', topic=topic)

@stack.route('/create_topic', methods=['POST'])
@login_required
def create_topic():
    title = request.form.get('title')
    description = request.form.get('description')
    
    new_topic = Topic(title=title, description=description, author=current_user)
    db.session.add(new_topic)
    db.session.commit()
    
    flash('Topic created successfully!', 'success')
    return redirect(url_for('stack.index'))

@stack.route('/add_card/<int:topic_id>', methods=['POST'])
@login_required
def add_card(topic_id):
    topic = Topic.query.get_or_404(topic_id)
    if topic.author != current_user:
        flash('You can only add cards to your own topics!', 'danger')
        return redirect(url_for('stack.index'))
    
    question = request.form.get('question')
    answer = request.form.get('answer')
    
    new_card = Card(question=question, answer=answer, topic=topic)
    db.session.add(new_card)
    db.session.commit()
    
    flash('Card added successfully!', 'success')
    return redirect(url_for('stack.view_topic', topic_id=topic_id))

@stack.route('/review/<int:topic_id>')
@login_required
def review_topic(topic_id):
    topic = Topic.query.get_or_404(topic_id)
    if topic.author != current_user:
        flash('You can only review your own topics!', 'danger')
        return redirect(url_for('stack.index'))
    
    # Simple spaced repetition: get cards due for review
    now = datetime.utcnow()
    cards_to_review = Card.query.filter(
        (Card.topic_id == topic_id) & 
        ((Card.next_review == None) | (Card.next_review <= now))
    ).all()
    
    if not cards_to_review:
        flash('No cards to review right now!', 'info')
        return redirect(url_for('stack.view_topic', topic_id=topic_id))
    
    return render_template('review.html', card=cards_to_review[0], topic=topic)

@stack.route('/submit_review/<int:card_id>', methods=['POST'])
@login_required
def submit_review(card_id):
    card = Card.query.get_or_404(card_id)
    topic = card.topic
    if topic.author != current_user:
        flash('You can only review your own cards!', 'danger')
        return redirect(url_for('stack.index'))
    
    difficulty = int(request.form.get('difficulty', 3))
    card.difficulty = difficulty
    card.last_reviewed = datetime.utcnow()
    
    # Simple spaced repetition algorithm
    if difficulty <= 2:
        interval = 1  # days
    elif difficulty == 3:
        interval = 3
    else:
        interval = 7
    
    card.next_review = datetime.utcnow() + timedelta(days=interval)
    db.session.commit()
    
    flash('Review submitted!', 'success')
    return redirect(url_for('stack.review_topic', topic_id=topic.id))