import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import numpy as np

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except Exception as e:
    print("Warning: Failed to import firebase_admin:", e)
    firebase_admin = None
    firestore = None

try:
    import google.generativeai as genai
except Exception as e:
    print("Warning: Failed to import google.generativeai:", e)
    genai = None

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

class LocalDocRef:
    def __init__(self, id, data):
        self.id = id
        self.data = data
        self.exists = data is not None
    def to_dict(self):
        return self.data
    def get(self):
        return self
    def set(self, data):
        self.data = data
        self.exists = True
    def update(self, data):
        if not self.data: self.data = {}
        for k, v in data.items():
            if isinstance(v, firestore.Increment if hasattr(firestore, 'Increment') else type(None)):
                self.data[k] = self.data.get(k, 0) + v.value
            else:
                self.data[k] = v

class LocalCollection:
    def __init__(self, name):
        self.name = name
        self.docs = {}
    def document(self, id):
        if id not in self.docs:
            self.docs[id] = None
        return LocalDocRef(id, self.docs.get(id))
    def add(self, data):
        new_id = str(uuid.uuid4())
        self.docs[new_id] = data
        return None, LocalDocRef(new_id, data)
    def stream(self):
        return [LocalDocRef(k, v) for k, v in self.docs.items() if v is not None]
    def get(self):
        return self.stream()
    def limit(self, n):
        return self  # mock
    def order_by(self, field, direction=None):
        return self  # mock

class LocalFirestore:
    def __init__(self):
        self.cols = {}
    def collection(self, name):
        if name not in self.cols:
            self.cols[name] = LocalCollection(name)
        return self.cols[name]

# Initialize Firebase
cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
if firebase_admin is not None:
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    elif not firebase_admin._apps:
        print("WARNING: Using anonymous firebase-admin for local dev because FIREBASE_CREDENTIALS_PATH is missing.")
        try:
            firebase_admin.initialize_app()
        except Exception as e:
            pass

try:
    if firebase_admin and os.getenv('FIREBASE_CREDENTIALS_PATH') and firestore:
        db = firestore.client()
    else:
        db = LocalFirestore()
except Exception as e:
    print("Firestore client error:", e)
    db = LocalFirestore()

# Initialize Gemini
if genai:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY", "dummy_key"))

def convert_doc(doc_ref):
    data = doc_ref.to_dict()
    if data:
        data['_id'] = doc_ref.id
    return data

def get_projects():
    if not db: return []
    return [convert_doc(doc) for doc in db.collection('projects').stream()]

# seed logic if empty
if db:
    alumns = list(db.collection('alumni').limit(1).stream())
    alumni_ids = []
    if not alumns:
        print("Initializing DB with mock alumni data...")
        a_col = db.collection('alumni')
        _, al1 = a_col.add({
            "name": "Rahul Kumar", "graduation_year": "2022", "department": "CSE",
            "current_role": "Software Engineer", "company": "Infosys",
            "skills": ["Python", "AI", "Machine Learning"],
            "bio": "Passionate about AI and building scalable web apps. Happy to help current students.",
            "linkedin": "https://linkedin.com", "github": "https://github.com",
            "profile_picture": "https://ui-avatars.com/api/?name=Rahul+Kumar&background=10b981&color=fff"
        })
        alumni_ids.append(al1.id)
        
        _, al2 = a_col.add({
            "name": "Sneha Reddy", "graduation_year": "2023", "department": "AIML",
            "current_role": "Data Analyst", "company": "TCS",
            "skills": ["Data Science", "NLP", "Python", "AI"],
            "bio": "Extracting insights from unstructured data. Feel free to reach out for hackathon advice.",
            "linkedin": "https://linkedin.com", "github": "https://github.com",
            "profile_picture": "https://ui-avatars.com/api/?name=Sneha+Reddy&background=f59e0b&color=fff"
        })
        alumni_ids.append(al2.id)

        _, al3 = a_col.add({
            "name": "Arjun Patel", "graduation_year": "2021", "department": "IT",
            "current_role": "Full Stack Developer", "company": "Amazon",
            "skills": ["React", "Node", "MongoDB", "Web"],
            "bio": "Building robust web platforms. Always down to review code PRs.",
            "linkedin": "https://linkedin.com", "github": "https://github.com",
            "profile_picture": "https://ui-avatars.com/api/?name=Arjun+Patel&background=3b82f6&color=fff"
        })
        alumni_ids.append(al3.id)

        _, al4 = a_col.add({
            "name": "Priya Sharma", "graduation_year": "2022", "department": "AIML",
            "current_role": "ML Engineer", "company": "Google",
            "skills": ["Machine Learning", "TensorFlow", "Computer Vision", "AI"],
            "bio": "Training next-gen ML models. Ask me about deploying AI in production.",
            "linkedin": "https://linkedin.com", "github": "https://github.com",
            "profile_picture": "https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff"
        })
        alumni_ids.append(al4.id)

        _, al5 = a_col.add({
            "name": "Karthik Varma", "graduation_year": "2020", "department": "CSE",
            "current_role": "Cloud Engineer", "company": "Microsoft",
            "skills": ["AWS", "DevOps", "Docker", "Cloud", "Web"],
            "bio": "Scaling infrastructure for millions. Let's talk about cloud architecture.",
            "linkedin": "https://linkedin.com", "github": "https://github.com",
            "profile_picture": "https://ui-avatars.com/api/?name=Karthik+Varma&background=ec4899&color=fff"
        })
        alumni_ids.append(al5.id)

        _, al6 = a_col.add({
            "name": "Megha Nair", "graduation_year": "2021", "department": "Cybersecurity",
            "current_role": "Cybersecurity Analyst", "company": "Palo Alto",
            "skills": ["Security", "Networking", "Cybersecurity", "IoT"],
            "bio": "Securing the modern web. I can help test your IoT and Web projects for vulnerabilities.",
            "linkedin": "https://linkedin.com", "github": "https://github.com",
            "profile_picture": "https://ui-avatars.com/api/?name=Megha+Nair&background=06b6d4&color=fff"
        })
        alumni_ids.append(al6.id)
    else:
        # DB already has some alumni, fetch all ids for seeded projects
        alumni_ids = [doc.id for doc in db.collection('alumni').stream()]

    projs = list(db.collection('projects').limit(1).stream())
    if not projs:
        print("Initializing DB with mock projects data...")
        users_col = db.collection('users')
        p_col = db.collection('projects')
        c_col = db.collection('community_posts')
        
        users_col.document('mock_user_1').set({
            "name": "Alice Dev", "email": "alice@univ.edu", "department": "Computer Science", "year": "3"
        })
        
        _, ref1 = p_col.add({
            "title": "Smart Attendance System", 
            "description": "A basic system to record student attendance.",
            "domain": "AI", "tech_stack": "Python, OpenCV", "keywords": ["attendance", "computer vision"],
            "year": "2023", "submitted_by": "Harika", "views": 100, "created_at": datetime.datetime.now(),
            "extends_id": None, "image_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
            "alumni_contributors": [alumni_ids[0]] if len(alumni_ids) > 0 else []
        })
        _, ref2 = p_col.add({
            "title": "Face Recognition Attendance Pro", 
            "description": "Upgraded attendance system using advanced 3D face recognition to prevent spoofing and automate the process across multiple classrooms.",
            "domain": "AI", "tech_stack": "Python, OpenCV, Dlib, PyTorch", "keywords": ["attendance", "face recognition", "deep learning"],
            "year": "2023", "submitted_by": "Bob Maker", "views": 450, "created_at": datetime.datetime.now(),
            "extends_id": ref1.id, "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
        })
        _, ref3 = p_col.add({
            "title": "Decentralized Voting DApp", 
            "description": "A secure voting application built on Ethereum smart contracts. Ensures complete transparency and tamper-proof elections for student councils.",
            "domain": "Web", "tech_stack": "Solidity, React, Ethers.js", "keywords": ["blockchain", "voting", "dapp"],
            "year": "2024", "submitted_by": "Charlie Crypto", "views": 320, "created_at": datetime.datetime.now(),
            "extends_id": None, "image_url": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
            "alumni_contributors": [alumni_ids[1]] if len(alumni_ids) > 1 else []
        })
        _, ref4 = p_col.add({
            "title": "Campus Nav AR", 
            "description": "An augmented reality pathfinding app designed to help freshers navigate huge campus buildings without getting lost.",
            "domain": "App", "tech_stack": "Unity, ARCore, C#", "keywords": ["AR", "navigation", "campus"],
            "year": "2024", "submitted_by": "Diana Prince", "views": 850, "created_at": datetime.datetime.now(),
            "extends_id": None, "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
        })
        _, ref5 = p_col.add({
            "title": "IoT Smart Parking", 
            "description": "Sensor-based system that detects parking slot availability in the university basement and updates a real-time mobile app dashboard.",
            "domain": "IoT", "tech_stack": "Arduino, NodeMCU, Firebase", "keywords": ["IoT", "parking", "smart campus"],
            "year": "2023", "submitted_by": "Evan Tech", "views": 210, "created_at": datetime.datetime.now(),
            "extends_id": None, "image_url": "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800"
        })
        _, ref6 = p_col.add({
            "title": "IoT Smart Parking with ML Pricing", 
            "description": "Extends the Smart Parking system by adding machine learning to predict peak parking hours and dynamically adjust parking fees.",
            "domain": "Machine Learning", "tech_stack": "Python, scikit-learn, Firebase", "keywords": ["machine learning", "IoT", "parking"],
            "year": "2024", "submitted_by": "Fiona Stream", "views": 600, "created_at": datetime.datetime.now(),
            "extends_id": ref5.id, "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
        })
        _, ref7 = p_col.add({
            "title": "Hackathon Matchmaker", 
            "description": "A web platform that matches students looking for hackathon teams based on their complementary skills (e.g. matching a UI designer with a backend dev).",
            "domain": "Web", "tech_stack": "Next.js, Tailwind, MongoDB", "keywords": ["collaboration", "matchmaking", "web"],
            "year": "2024", "submitted_by": "George Dev", "views": 950, "created_at": datetime.datetime.now(),
            "extends_id": None, "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
        })
        _, ref3 = c_col.add({
            "user_name": "Alice Dev",
            "content": "Does anybody want to collaborate on a new decentralized voting system?",
            "comments": [{"user_name": "Bob Maker", "text": "I'm in!"}],
            "created_at": datetime.datetime.now()
        })


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    if not db: return jsonify(data), 200
    uid = data.get('uid')
    if uid:
        user_ref = db.collection('users').document(uid)
        doc = user_ref.get()
        
        updates = {}
        if data.get("name"): updates["name"] = data.get("name")
        if data.get("department"): updates["department"] = data.get("department")
        if data.get("year"): updates["year"] = data.get("year")
        if "github" in data: updates["github"] = data.get("github")
        if "linkedin" in data: updates["linkedin"] = data.get("linkedin")
        if "skills" in data: updates["skills"] = data.get("skills")
        if "bio" in data: updates["bio"] = data.get("bio")
        if "profile_picture" in data: updates["profile_picture"] = data.get("profile_picture")
        
        if doc.exists:
            existing = convert_doc(doc)
            if updates:
                user_ref.update(updates)
                existing.update(updates)
            return jsonify(existing), 200
        else:
            new_user = {
                "name": data.get("name", "New Student"),
                "email": data.get("email"),
                "department": data.get("department", "CSE"),
                "year": data.get("year", "1")
            }
            user_ref.set(new_user)
            new_user['_id'] = uid
            return jsonify(new_user), 200
    return jsonify({"error": "No uid provided"}), 400

@app.route('/api/projects/check_similarity', methods=['POST'])
def check_similarity():
    data = request.json
    description = data.get("description", "")
    if not db: return jsonify({"similar_ideas": []}), 200
    
    all_projects = get_projects()
    if not all_projects or not description:
        return jsonify({"similar_ideas": []}), 200
        
    descriptions = [p.get("description", "") for p in all_projects]
    titles = [p.get("title", "") for p in all_projects]
    ids = [str(p["_id"]) for p in all_projects]
    
    descriptions.append(description)
    
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        tfidf_matrix = vectorizer.fit_transform(descriptions)
        cosine_sim = cosine_similarity(tfidf_matrix[-1:], tfidf_matrix[:-1]).flatten()
        
        results = []
        for i, score in enumerate(cosine_sim):
            if score > 0.1:
                results.append({
                    "id": ids[i],
                    "title": titles[i],
                    "similarity": round(score * 100),
                    "description": all_projects[i].get("description", "")
                })
        
        results = sorted(results, key=lambda x: x["similarity"], reverse=True)[:3]
        return jsonify({"similar_ideas": results}), 200
    except Exception as e:
        print(f"Error checking similarity: {e}")
        return jsonify({"similar_ideas": []}), 200

@app.route('/api/projects', methods=['POST'])
def submit_project():
    data = request.json
    if not db: return jsonify({}), 201
    new_project = {
        "title": data.get("title"),
        "description": data.get("description"),
        "domain": data.get("domain", "Other"),
        "tech_stack": data.get("tech_stack", ""),
        "keywords": data.get("keywords", []),
        "year": data.get("year", "2024"),
        "submitted_by": data.get("submitted_by", "Anonymous"),
        "extends_id": data.get("extends_id", None),
        "views": 0,
        "created_at": datetime.datetime.now()
    }
    _, doc_ref = db.collection('projects').add(new_project)
    new_project['_id'] = doc_ref.id
    return jsonify(new_project), 201

@app.route('/api/graph', methods=['GET'])
def get_graph():
    all_projects = get_projects()
    nodes = []
    edges = []
    
    for p in all_projects:
        pid = str(p["_id"])
        nodes.append({
            "id": pid,
            "label": p.get("title"),
            "title": p.get("domain"),
            "group": p.get("domain")
        })
        if p.get("extends_id"):
            edges.append({
                "from": p.get("extends_id"),
                "to": pid,
                "arrows": "to",
                "label": "extends"
            })
            
    return jsonify({"nodes": nodes, "edges": edges}), 200

@app.route('/api/projects', methods=['GET'])
def list_projects():
    domain = request.args.get('domain')
    search = request.args.get('search')
    sort_by = request.args.get('sort_by')
    
    all_projects = get_projects()
    
    if domain and domain != "All":
        all_projects = [p for p in all_projects if p.get('domain') == domain]
    
    if search:
        search_lower = search.lower()
        all_projects = [p for p in all_projects if search_lower in p.get('title', '').lower() or search_lower in p.get('description', '').lower()]
        
    if sort_by == 'trending':
        all_projects = sorted(all_projects, key=lambda x: x.get('views', 0), reverse=True)
        
    return jsonify(all_projects), 200

@app.route('/api/projects/<pid>', methods=['GET'])
def get_project(pid):
    if not db: return jsonify({"error": "No db"}), 500
    
    doc_ref = db.collection('projects').document(pid)
    doc = doc_ref.get()
    if not doc.exists:
        return jsonify({"error": "Not found"}), 404
        
    if firestore:
        doc_ref.update({"views": firestore.Increment(1)})
    else:
        doc_ref.update({"views": doc.to_dict().get("views", 0) + 1})
    
    project = convert_doc(doc)
    all_projects = get_projects()
    
    similar = []
    other_projects = [p for p in all_projects if p["_id"] != pid]
    
    if other_projects:
        descriptions = [p.get("description", "") for p in other_projects]
        descriptions.append(project.get("description", ""))
        vectorizer = TfidfVectorizer(stop_words='english')
        try:
            tfidf_matrix = vectorizer.fit_transform(descriptions)
            cosine_sim = cosine_similarity(tfidf_matrix[-1:], tfidf_matrix[:-1]).flatten()
            for i, score in enumerate(cosine_sim):
                if score > 0.1:
                    sim_doc = other_projects[i]
                    sim_doc['similarity'] = round(score * 100)
                    similar.append(sim_doc)
            similar = sorted(similar, key=lambda x: x["similarity"], reverse=True)[:3]
        except:
            pass
            
    extensions = [p for p in all_projects if p.get("extends_id") == pid]
    
    alumni_data = []
    if project.get("alumni_contributors"):
        for aid in project["alumni_contributors"]:
            a_doc = db.collection('alumni').document(aid).get()
            if a_doc.exists:
                alumni_data.append(convert_doc(a_doc))
                
    suggested_mentors = []
    if not alumni_data:
        all_alumni = [convert_doc(doc) for doc in db.collection('alumni').stream()]
        proj_domain = project.get("domain", "").lower()
        proj_kws = [k.lower() for k in project.get("keywords", [])]
        
        for al in all_alumni:
            skills = " ".join(al.get("skills", [])).lower()
            dept = al.get("department", "").lower()
            if proj_domain in dept or proj_domain in skills or any(kw in skills for kw in proj_kws):
                suggested_mentors.append(al)
                if len(suggested_mentors) == 2:
                    break
        if not suggested_mentors and all_alumni:
            suggested_mentors = all_alumni[:2]
                
    project['similar'] = similar
    project['extensions'] = extensions
    project['alumni'] = alumni_data
    project['suggested_mentors'] = suggested_mentors
    return jsonify(project), 200

@app.route('/api/alumni', methods=['GET'])
def get_alumni():
    if not db: return jsonify([]), 200
    alumni = [convert_doc(doc) for doc in db.collection('alumni').stream()]
    return jsonify(alumni), 200

@app.route('/api/alumni/mentorship', methods=['POST'])
def mentorship_request():
    data = request.json
    if not db: return jsonify({}), 201
    
    req_data = {
        "student_name": data.get("student_name"),
        "student_id": data.get("student_id"),
        "alumni_id": data.get("alumni_id"),
        "project_id": data.get("project_id"),
        "message": data.get("message"),
        "created_at": datetime.datetime.now()
    }
    
    _, doc_ref = db.collection('mentorship_requests').add(req_data)
    req_data['_id'] = doc_ref.id
    return jsonify(req_data), 201

@app.route('/api/community', methods=['GET', 'POST'])
def community():
    if not db: return jsonify([]), 200
    c_col = db.collection('community_posts')
    if request.method == 'GET':
        if firestore:
            posts = [convert_doc(doc) for doc in c_col.order_by('created_at', direction=firestore.Query.DESCENDING).stream()]
        else:
            posts = [convert_doc(doc) for doc in c_col.stream()]
            posts.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        return jsonify(posts), 200
    
    data = request.json
    new_post = {
        "user_name": data.get("user_name", "Anonymous"),
        "content": data.get("content"),
        "comments": [],
        "created_at": datetime.datetime.now()
    }
    _, doc_ref = c_col.add(new_post)
    new_post['_id'] = doc_ref.id
    return jsonify(new_post), 201

@app.route('/api/community/<pid>/comments', methods=['POST'])
def add_comment(pid):
    if not db: return jsonify({}), 200
    data = request.json
    comment = {
        "user_name": data.get("user_name"),
        "text": data.get("text")
    }
    doc_ref = db.collection('community_posts').document(pid)
    if firestore:
        doc_ref.update({
            "comments": firestore.ArrayUnion([comment])
        })
    else:
        doc = doc_ref.get()
        comments = doc.to_dict().get("comments", [])
        comments.append(comment)
        doc_ref.update({"comments": comments})
    return jsonify({"success": True}), 200

@app.route('/api/ideas/suggest', methods=['POST'])
def suggest_idea():
    data = request.json
    title = data.get("title", "")
    description = data.get("description", "")
    domain = data.get("domain", "")

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f'''You are an expert project mentor for university students.
A student has the following project idea:

Title: {title}
Description: {description}
Domain: {domain}

Provide:
1. Suggestions to improve this idea
2. Example projects related to this idea
3. Relevant research papers or academic references (include mock or real URLs if possible)
4. Technologies and tools required to build this project

Keep responses structured and student-friendly.
You MUST respond with a raw, valid JSON object exactly matching this format, with no markdown formatting or extra text:
{{
  "suggestions": ["string", "string"],
  "example_projects": ["string", "string"],
  "research_papers": ["string", "string"],
  "technologies": ["string", "string"]
}}
'''
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        import json
        result = json.loads(text)
        return jsonify(result), 200
    except Exception as e:
        print("Gemini Suggest Error:", e)
        return jsonify({
            "suggestions": ["Consider adding real-time capabilities", f"Focus on a mobile-first approach for your {domain} project", "Integrate an analytics dashboard"],
            "example_projects": ["Open Source Smart Dashboard on GitHub", f"University Capstone {domain} App"],
            "research_papers": [f"A comprehensive study on modernized {domain} architectures", "Recent Advances in Student Hackathon Projects"],
            "technologies": ["React", "Node.js", "Firebase", "Python", "Tailwind CSS"]
        }), 200

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    query = data.get("query", "")
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f'''You are CampusIdeaHub's AI assistant, a helpful and technical mentor for campus students looking for project ideas or tech stack recommendations. Keep answers concise, friendly, and structured. Answer the following student query: {query}'''
        response = model.generate_content(prompt)
        reply = response.text
    except Exception as e:
        print("Gemini Error:", e)
        domains = ["AI", "Web", "IoT", "Cybersecurity", "Cloud", "App", "Machine Learning", "ML"]
        detected = next((d for d in domains if d.lower() in query.lower()), None)
        if detected:
            reply = f"I'm currently unable to connect to the Gemini API, but I saw you're asking about {detected}. Consider checking out our {detected} projects on the Explore page! You could build an ML pipeline, a prediction dashboard, or AI automation tools."
        elif "suggest" in query.lower() or "idea" in query.lower():
            reply = "I'm having trouble connecting to Gemini API directly right now, but some trending ideas are: AI Smart Attendance, IoT Parking System, Decentralized Voting DApp, and Blockchain certificate verification."
        else:
            reply = "I'm having trouble connecting to the Gemini API right now. Please try again later or make sure the API key is configured correctly."
            
    return jsonify({"reply": reply}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
