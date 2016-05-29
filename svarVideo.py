from flask import Flask, request
from flask_restful import Resource, Api, reqparse
import base64, os

projectPath =  os.path.dirname(os.path.realpath(__file__))
print projectPath
app = Flask(__name__)
api = Api(app)

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

if __name__ == '__main__':
    app.run()
