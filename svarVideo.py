from flask import Flask, request, jsonify, session
from flask_restful import Resource, Api, reqparse
from flask.ext.bcrypt import Bcrypt
from flask.ext.sqlalchemy import SQLAlchemy
#from svarVideo.config import BaseConfig
import base64, os
import datetime

projectPath =  os.path.dirname(os.path.realpath(__file__))
print projectPath

class BaseConfig(object):
    SECRET_KEY = 'my_precious'
    DEBUG = True
    BCRYPT_LOG_ROUNDS = 13
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(projectPath, 'db.sqlite')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

app = Flask(__name__)
api = Api(app)
app.config.from_object(BaseConfig)
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    #email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, email, password, admin=False):
        self.email = email
        self.password = bcrypt.generate_password_hash(password)
        print self.password
        #self.password = password
        self.registered_on = datetime.datetime.now()
        self.admin = admin

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    def __repr__(self):
        return '<User {0}>'.format(self.email)

class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

    def put(self):
        data = request.form
        name_hurr = data['data']
        print name_hurr
        #print data
        return 1

    def post(self):
        print "post hit"
        json_data = request.get_json(force=True)
        print json_data
        file_name = json_data['name']
        file_type = json_data['type']

        contents_base64 = json_data['contents']
        #print contents_base64
        contents_arr = contents_base64.split(',')
        contents = contents_arr[1]
        print contents

        contents = base64.b64decode(contents)
        #print contents
        print file_name
        f = open(projectPath + '\\' + file_name, 'wb')
        f.write(contents)
        f.close()
        print "DONE"
        return 1

api.add_resource(HelloWorld, '/api/video')
db.create_all()
#firstUser = User("gursimran.singh@aspiringminds.in", "hello")
#db.session.add(firstUser)
#db.session.commit()

# Test using this code on cmd
#from requests import put, get, post
#put('http://localhost:5000/api/video', data={'data': 'Remember the milk'}).json()
#post('http://localhost:5000/api/video', data={'data': 'Remember the milk'}).json()
#get('http://localhost:5000/api/video').json()

#@app.route('/')
#def hello_world():
#    return 'Hello World!'

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    json_data = request.json
    user = User(
        email=json_data['email'],
        password=json_data['password']
    )
    print user
    try:
        db.session.add(user)
        db.session.commit()
        status = 'success'
    except:
        status = 'this user is already registered'
    db.session.close()
    return jsonify({'result': status})

@app.route('/api/login', methods=['POST'])
def login():
    json_data = request.json
    user = User.query.filter_by(email=json_data['email']).first()
    #print user
    #print bcrypt.check_password_hash(user.password, json_data['password'])
    if user and bcrypt.check_password_hash(
            user.password, json_data['password']):
        session['logged_in'] = True
        status = True
        print 'Login success'
        print user
    else:
        status = False
    return jsonify({'result': status})

@app.route('/api/logout')
def logout():
    session.pop('logged_in', None)
    return jsonify({'result': 'success'})

@app.route('/api/status')
def status():
    if session.get('logged_in'):
        if session['logged_in']:
            return jsonify({'status': True})
    else:
        return jsonify({'status': False})

if __name__ == '__main__':
    app.run()
