-- Synthos Seed Data
-- 80+ Skills, Adjacency Map, Career Paths

-- ===================== SKILLS =====================
INSERT INTO skills (name, category, market_demand_score, demand_trend, yoy_change, avg_salary_impact, learning_hours, description) VALUES
-- Programming
('Python', 'Programming', 94, 'growing', 23.0, 28000, 200, 'General-purpose programming language dominant in data science, ML, and backend development'),
('JavaScript', 'Programming', 91, 'growing', 31.0, 22000, 250, 'The language of the web — frontend, backend (Node.js), and full-stack development'),
('TypeScript', 'Programming', 86, 'growing', 35.0, 18000, 80, 'Typed superset of JavaScript for large-scale application development'),
('SQL', 'Programming', 88, 'stable', 8.0, 18000, 100, 'Standard language for relational database querying and management'),
('Java', 'Programming', 79, 'stable', 4.0, 20000, 300, 'Enterprise-grade language for backend systems and Android development'),
('Go', 'Programming', 82, 'growing', 16.0, 24000, 200, 'Google-designed systems language for cloud infrastructure and microservices'),
('Rust', 'Programming', 71, 'growing', 35.0, 22000, 350, 'Memory-safe systems programming language gaining traction in infrastructure'),
('R', 'Programming', 63, 'declining', -5.0, 12000, 150, 'Statistical computing language popular in academia and research'),
('C++', 'Programming', 68, 'stable', 2.0, 20000, 400, 'High-performance systems programming language'),
('Bash', 'Programming', 72, 'stable', 3.0, 8000, 60, 'Unix shell scripting for automation and DevOps'),
('NoSQL', 'Programming', 74, 'growing', 12.0, 14000, 80, 'Non-relational database technologies like MongoDB and DynamoDB'),
('GraphQL', 'Programming', 75, 'growing', 20.0, 14000, 60, 'API query language for flexible client-driven data fetching'),
('REST APIs', 'Programming', 83, 'stable', 6.0, 12000, 60, 'Representational State Transfer API design and implementation'),
('YAML', 'Programming', 55, 'stable', 2.0, 4000, 20, 'Data serialization format used in DevOps and configuration'),

-- Data & AI
('Machine Learning', 'Data & AI', 97, 'growing', 67.0, 35000, 400, 'Building systems that learn from data to make predictions'),
('Deep Learning', 'Data & AI', 93, 'growing', 58.0, 38000, 500, 'Neural network architectures for complex pattern recognition'),
('NLP', 'Data & AI', 88, 'growing', 45.0, 32000, 350, 'Natural Language Processing for text understanding and generation'),
('Computer Vision', 'Data & AI', 85, 'growing', 40.0, 34000, 400, 'Image and video understanding using deep learning'),
('Data Analysis', 'Data & AI', 85, 'growing', 22.0, 24000, 150, 'Extracting insights from structured and unstructured data'),
('Statistics', 'Data & AI', 80, 'stable', 8.0, 18000, 200, 'Mathematical foundations for data science and experimentation'),
('TensorFlow', 'Data & AI', 78, 'stable', 9.0, 20000, 200, 'Google open-source ML framework for production systems'),
('PyTorch', 'Data & AI', 85, 'growing', 38.0, 22000, 200, 'Facebook ML framework preferred in research and production'),
('scikit-learn', 'Data & AI', 74, 'stable', 8.0, 14000, 100, 'Python ML library for classical algorithms'),
('Tableau', 'Data & AI', 61, 'stable', 3.0, 10000, 60, 'Business intelligence visualization platform'),
('Power BI', 'Data & AI', 68, 'growing', 12.0, 12000, 60, 'Microsoft business analytics and visualization tool'),
('Apache Spark', 'Data & AI', 74, 'stable', 6.0, 22000, 200, 'Distributed computing engine for big data processing'),
('dbt', 'Data & AI', 72, 'growing', 45.0, 18000, 80, 'Data transformation tool for analytics engineering'),
('Airflow', 'Data & AI', 70, 'growing', 18.0, 16000, 120, 'Workflow orchestration platform for data pipelines'),

-- Cloud & DevOps
('AWS', 'Cloud & DevOps', 92, 'growing', 38.0, 32000, 300, 'Amazon Web Services — dominant cloud platform'),
('Azure', 'Cloud & DevOps', 87, 'growing', 28.0, 28000, 250, 'Microsoft cloud platform for enterprise workloads'),
('GCP', 'Cloud & DevOps', 83, 'growing', 22.0, 28000, 250, 'Google Cloud Platform strong in data and ML'),
('Docker', 'Cloud & DevOps', 87, 'growing', 29.0, 20000, 120, 'Container runtime for application packaging and deployment'),
('Kubernetes', 'Cloud & DevOps', 85, 'growing', 41.0, 28000, 200, 'Container orchestration platform for scalable deployments'),
('Terraform', 'Cloud & DevOps', 80, 'growing', 21.0, 22000, 150, 'Infrastructure as Code for multi-cloud provisioning'),
('CI/CD', 'Cloud & DevOps', 83, 'growing', 15.0, 16000, 100, 'Continuous Integration and Deployment pipeline design'),
('Linux', 'Cloud & DevOps', 78, 'stable', 4.0, 14000, 200, 'Server operating system — foundation of cloud infrastructure'),
('Networking', 'Cloud & DevOps', 70, 'stable', 4.0, 16000, 250, 'TCP/IP, DNS, load balancing, and network architecture'),
('Security', 'Cloud & DevOps', 87, 'growing', 26.0, 30000, 300, 'Application and infrastructure security practices'),

-- Product & Design
('Product Management', 'Product & Design', 83, 'growing', 19.0, 30000, 200, 'Strategic product lifecycle management and roadmapping'),
('UX Design', 'Product & Design', 79, 'growing', 14.0, 22000, 250, 'User experience research, wireframing, and prototyping'),
('Figma', 'Product & Design', 82, 'growing', 25.0, 16000, 100, 'Collaborative design tool for UI/UX workflows'),
('User Research', 'Product & Design', 74, 'growing', 11.0, 18000, 150, 'Qualitative and quantitative user study methodologies'),
('A/B Testing', 'Product & Design', 76, 'growing', 18.0, 16000, 80, 'Controlled experimentation for product optimization'),
('Roadmapping', 'Product & Design', 72, 'stable', 8.0, 14000, 60, 'Strategic product planning and prioritization'),
('Agile', 'Product & Design', 80, 'stable', 4.0, 12000, 40, 'Iterative development methodology'),
('Scrum', 'Product & Design', 72, 'stable', 2.0, 10000, 40, 'Agile framework for sprint-based delivery'),

-- Business & Soft Skills
('Leadership', 'Business & Soft Skills', 78, 'growing', 12.0, 22000, 300, 'Team leadership, mentorship, and organizational influence'),
('Communication', 'Business & Soft Skills', 76, 'stable', 5.0, 15000, 200, 'Written and verbal communication for technical and business contexts'),
('Strategy', 'Business & Soft Skills', 74, 'stable', 6.0, 20000, 200, 'Business strategy, market analysis, and competitive positioning'),
('Finance', 'Business & Soft Skills', 70, 'stable', 4.0, 18000, 200, 'Financial modeling, budgeting, and business analysis'),
('Marketing', 'Business & Soft Skills', 68, 'stable', 3.0, 14000, 150, 'Growth marketing, brand strategy, and campaign management'),
('Sales', 'Business & Soft Skills', 72, 'stable', 5.0, 20000, 150, 'B2B/B2C sales methodologies and relationship management'),
('Negotiation', 'Business & Soft Skills', 68, 'stable', 4.0, 16000, 100, 'Deal-making and conflict resolution skills'),
('Data Storytelling', 'Business & Soft Skills', 71, 'growing', 13.0, 14000, 80, 'Translating data insights into compelling business narratives'),
('Excel', 'Business & Soft Skills', 52, 'declining', -14.0, 4000, 40, 'Spreadsheet analysis — increasingly commoditized'),
('Manual Testing', 'Business & Soft Skills', 38, 'declining', -22.0, 2000, 60, 'Manual QA testing — being replaced by automation'),
('Basic HTML/CSS', 'Business & Soft Skills', 45, 'declining', -8.0, 3000, 40, 'Basic web markup — insufficient alone for modern roles'),

-- Emerging
('Prompt Engineering', 'Emerging', 88, 'growing', 120.0, 25000, 60, 'Designing effective prompts for large language models'),
('LLM Fine-tuning', 'Emerging', 91, 'growing', 145.0, 40000, 300, 'Customizing large language models for specific domains'),
('RAG Systems', 'Emerging', 89, 'growing', 130.0, 38000, 250, 'Retrieval-Augmented Generation for grounded AI applications'),
('AI Agents', 'Emerging', 87, 'growing', 160.0, 42000, 300, 'Autonomous AI systems that plan and execute tasks'),
('Vector Databases', 'Emerging', 83, 'growing', 110.0, 28000, 100, 'Specialized databases for embedding similarity search'),
('Web3', 'Emerging', 48, 'declining', -30.0, 15000, 200, 'Blockchain-based decentralized application development'),
('Smart Contracts', 'Emerging', 45, 'declining', -25.0, 18000, 200, 'Blockchain programmatic contracts (Solidity)'),
('AR/VR Development', 'Emerging', 55, 'stable', 5.0, 20000, 300, 'Augmented and virtual reality application development'),

-- Additional Skills
('Node.js', 'Programming', 84, 'growing', 15.0, 18000, 150, 'JavaScript runtime for server-side development'),
('React', 'Programming', 89, 'growing', 28.0, 20000, 150, 'Facebook UI library for component-based web development'),
('MLOps', 'Data & AI', 86, 'growing', 55.0, 30000, 200, 'ML model deployment, monitoring, and lifecycle management'),
('Data Engineering', 'Data & AI', 88, 'growing', 35.0, 28000, 250, 'Data pipeline architecture and infrastructure'),
('Test Automation', 'Cloud & DevOps', 78, 'growing', 18.0, 16000, 120, 'Automated testing frameworks and CI integration'),
('Microservices', 'Cloud & DevOps', 80, 'growing', 15.0, 20000, 150, 'Distributed systems architecture pattern'),
('Redis', 'Programming', 72, 'stable', 8.0, 10000, 40, 'In-memory data store for caching and real-time features'),
('PostgreSQL', 'Programming', 82, 'growing', 14.0, 16000, 80, 'Advanced open-source relational database'),
('MongoDB', 'Programming', 70, 'stable', 5.0, 12000, 60, 'Document-oriented NoSQL database'),
('FastAPI', 'Programming', 78, 'growing', 45.0, 14000, 60, 'High-performance Python web framework'),
('Django', 'Programming', 72, 'stable', 5.0, 14000, 120, 'Full-featured Python web framework'),
('Product Metrics', 'Product & Design', 77, 'growing', 16.0, 18000, 80, 'KPIs, OKRs, and product performance measurement');


-- ===================== ADJACENCY MAP =====================
-- Using a function to look up skill IDs by name
DO $$
DECLARE
  _python UUID; _js UUID; _ts UUID; _sql UUID; _java UUID; _go UUID;
  _rust UUID; _r UUID; _cpp UUID; _bash UUID; _nosql UUID; _graphql UUID;
  _rest UUID; _ml UUID; _dl UUID; _nlp UUID; _cv UUID; _da UUID;
  _stats UUID; _tf UUID; _pytorch UUID; _sklearn UUID; _tab UUID;
  _pbi UUID; _spark UUID; _dbt UUID; _airflow UUID; _aws UUID;
  _azure UUID; _gcp UUID; _docker UUID; _k8s UUID; _terraform UUID;
  _cicd UUID; _linux UUID; _net UUID; _sec UUID; _pm UUID;
  _ux UUID; _figma UUID; _ur UUID; _ab UUID; _road UUID;
  _agile UUID; _scrum UUID; _lead UUID; _comm UUID; _strat UUID;
  _fin UUID; _neg UUID; _ds UUID; _pe UUID; _llm UUID;
  _rag UUID; _node UUID; _react UUID; _mlops UUID; _de UUID;
  _micro UUID; _pg UUID; _fastapi UUID; _pmetrics UUID;
BEGIN
  SELECT id INTO _python FROM skills WHERE name='Python';
  SELECT id INTO _js FROM skills WHERE name='JavaScript';
  SELECT id INTO _ts FROM skills WHERE name='TypeScript';
  SELECT id INTO _sql FROM skills WHERE name='SQL';
  SELECT id INTO _java FROM skills WHERE name='Java';
  SELECT id INTO _go FROM skills WHERE name='Go';
  SELECT id INTO _rust FROM skills WHERE name='Rust';
  SELECT id INTO _r FROM skills WHERE name='R';
  SELECT id INTO _cpp FROM skills WHERE name='C++';
  SELECT id INTO _bash FROM skills WHERE name='Bash';
  SELECT id INTO _nosql FROM skills WHERE name='NoSQL';
  SELECT id INTO _graphql FROM skills WHERE name='GraphQL';
  SELECT id INTO _rest FROM skills WHERE name='REST APIs';
  SELECT id INTO _ml FROM skills WHERE name='Machine Learning';
  SELECT id INTO _dl FROM skills WHERE name='Deep Learning';
  SELECT id INTO _nlp FROM skills WHERE name='NLP';
  SELECT id INTO _cv FROM skills WHERE name='Computer Vision';
  SELECT id INTO _da FROM skills WHERE name='Data Analysis';
  SELECT id INTO _stats FROM skills WHERE name='Statistics';
  SELECT id INTO _tf FROM skills WHERE name='TensorFlow';
  SELECT id INTO _pytorch FROM skills WHERE name='PyTorch';
  SELECT id INTO _sklearn FROM skills WHERE name='scikit-learn';
  SELECT id INTO _tab FROM skills WHERE name='Tableau';
  SELECT id INTO _pbi FROM skills WHERE name='Power BI';
  SELECT id INTO _spark FROM skills WHERE name='Apache Spark';
  SELECT id INTO _dbt FROM skills WHERE name='dbt';
  SELECT id INTO _airflow FROM skills WHERE name='Airflow';
  SELECT id INTO _aws FROM skills WHERE name='AWS';
  SELECT id INTO _azure FROM skills WHERE name='Azure';
  SELECT id INTO _gcp FROM skills WHERE name='GCP';
  SELECT id INTO _docker FROM skills WHERE name='Docker';
  SELECT id INTO _k8s FROM skills WHERE name='Kubernetes';
  SELECT id INTO _terraform FROM skills WHERE name='Terraform';
  SELECT id INTO _cicd FROM skills WHERE name='CI/CD';
  SELECT id INTO _linux FROM skills WHERE name='Linux';
  SELECT id INTO _net FROM skills WHERE name='Networking';
  SELECT id INTO _sec FROM skills WHERE name='Security';
  SELECT id INTO _pm FROM skills WHERE name='Product Management';
  SELECT id INTO _ux FROM skills WHERE name='UX Design';
  SELECT id INTO _figma FROM skills WHERE name='Figma';
  SELECT id INTO _ur FROM skills WHERE name='User Research';
  SELECT id INTO _ab FROM skills WHERE name='A/B Testing';
  SELECT id INTO _road FROM skills WHERE name='Roadmapping';
  SELECT id INTO _agile FROM skills WHERE name='Agile';
  SELECT id INTO _scrum FROM skills WHERE name='Scrum';
  SELECT id INTO _lead FROM skills WHERE name='Leadership';
  SELECT id INTO _comm FROM skills WHERE name='Communication';
  SELECT id INTO _strat FROM skills WHERE name='Strategy';
  SELECT id INTO _fin FROM skills WHERE name='Finance';
  SELECT id INTO _neg FROM skills WHERE name='Negotiation';
  SELECT id INTO _ds FROM skills WHERE name='Data Storytelling';
  SELECT id INTO _pe FROM skills WHERE name='Prompt Engineering';
  SELECT id INTO _llm FROM skills WHERE name='LLM Fine-tuning';
  SELECT id INTO _rag FROM skills WHERE name='RAG Systems';
  SELECT id INTO _node FROM skills WHERE name='Node.js';
  SELECT id INTO _react FROM skills WHERE name='React';
  SELECT id INTO _mlops FROM skills WHERE name='MLOps';
  SELECT id INTO _de FROM skills WHERE name='Data Engineering';
  SELECT id INTO _micro FROM skills WHERE name='Microservices';
  SELECT id INTO _pg FROM skills WHERE name='PostgreSQL';
  SELECT id INTO _fastapi FROM skills WHERE name='FastAPI';
  SELECT id INTO _pmetrics FROM skills WHERE name='Product Metrics';

  -- Python adjacencies
  INSERT INTO skill_adjacency (skill_from, skill_to, adjacency_score, co_occurrence_count) VALUES
  (_python, _ml, 0.89, 45000), (_python, _da, 0.85, 38000), (_python, _sql, 0.72, 32000),
  (_python, _rest, 0.68, 28000), (_python, _stats, 0.71, 25000), (_python, _tf, 0.76, 22000),
  (_python, _sklearn, 0.82, 30000), (_python, _dl, 0.74, 18000), (_python, _fastapi, 0.78, 15000),
  (_python, _pytorch, 0.72, 16000), (_python, _docker, 0.58, 20000), (_python, _airflow, 0.55, 12000),

  -- SQL adjacencies
  (_sql, _da, 0.91, 42000), (_sql, _python, 0.72, 32000), (_sql, _pbi, 0.65, 18000),
  (_sql, _dbt, 0.58, 14000), (_sql, _tab, 0.60, 16000), (_sql, _nosql, 0.55, 12000),
  (_sql, _pg, 0.82, 20000), (_sql, _spark, 0.52, 10000),

  -- JavaScript adjacencies
  (_js, _ts, 0.88, 35000), (_js, _rest, 0.78, 30000), (_js, _graphql, 0.65, 15000),
  (_js, _react, 0.94, 40000), (_js, _node, 0.85, 32000), (_js, _bash, 0.45, 10000),

  -- TypeScript adjacencies
  (_ts, _js, 0.88, 35000), (_ts, _graphql, 0.60, 12000), (_ts, _rest, 0.72, 22000),
  (_ts, _react, 0.85, 28000), (_ts, _node, 0.78, 20000),

  -- ML adjacencies
  (_ml, _dl, 0.82, 28000), (_ml, _stats, 0.88, 32000), (_ml, _python, 0.89, 45000),
  (_ml, _tf, 0.76, 22000), (_ml, _pytorch, 0.73, 20000), (_ml, _nlp, 0.70, 18000),
  (_ml, _cv, 0.68, 15000), (_ml, _sklearn, 0.85, 30000), (_ml, _mlops, 0.72, 12000),

  -- Deep Learning
  (_dl, _ml, 0.82, 28000), (_dl, _tf, 0.80, 20000), (_dl, _pytorch, 0.78, 18000),
  (_dl, _nlp, 0.72, 15000), (_dl, _cv, 0.75, 16000),

  -- Product Management
  (_pm, _agile, 0.85, 25000), (_pm, _ur, 0.78, 18000), (_pm, _da, 0.65, 15000),
  (_pm, _road, 0.92, 22000), (_pm, _ab, 0.68, 14000), (_pm, _scrum, 0.80, 20000),
  (_pm, _pmetrics, 0.88, 16000),

  -- Leadership adjacencies
  (_lead, _strat, 0.82, 20000), (_lead, _comm, 0.88, 25000),
  (_lead, _neg, 0.71, 12000), (_lead, _ds, 0.55, 8000),

  -- Data Analysis
  (_da, _stats, 0.80, 28000), (_da, _python, 0.85, 38000), (_da, _sql, 0.91, 42000),
  (_da, _tab, 0.72, 18000), (_da, _pbi, 0.68, 16000), (_da, _ds, 0.62, 10000),

  -- Cloud & DevOps
  (_docker, _k8s, 0.82, 25000), (_docker, _aws, 0.65, 20000), (_docker, _cicd, 0.72, 18000),
  (_docker, _linux, 0.68, 22000), (_docker, _terraform, 0.60, 14000), (_docker, _micro, 0.72, 15000),
  (_aws, _azure, 0.55, 12000), (_aws, _gcp, 0.55, 12000), (_aws, _docker, 0.65, 20000),
  (_aws, _terraform, 0.72, 18000), (_aws, _k8s, 0.60, 15000), (_aws, _sec, 0.58, 14000),
  (_k8s, _docker, 0.82, 25000), (_k8s, _terraform, 0.65, 12000), (_k8s, _cicd, 0.68, 14000),
  (_terraform, _aws, 0.72, 18000), (_terraform, _docker, 0.60, 14000), (_terraform, _cicd, 0.62, 12000),
  (_linux, _docker, 0.68, 22000), (_linux, _bash, 0.82, 20000), (_linux, _net, 0.65, 15000),
  (_linux, _sec, 0.58, 14000),

  -- Design adjacencies
  (_figma, _ux, 0.88, 22000), (_figma, _ur, 0.62, 10000), (_figma, _pm, 0.55, 8000),
  (_ux, _figma, 0.88, 22000), (_ux, _ur, 0.82, 18000), (_ux, _ab, 0.60, 10000),
  (_ux, _pm, 0.65, 12000),

  -- Communication adjacencies
  (_comm, _lead, 0.88, 25000), (_comm, _ds, 0.72, 12000), (_comm, _neg, 0.65, 10000),
  (_comm, _strat, 0.55, 8000),

  -- Emerging adjacencies
  (_pe, _llm, 0.85, 8000), (_pe, _rag, 0.78, 6000), (_pe, _nlp, 0.65, 5000), (_pe, _python, 0.60, 7000),
  (_llm, _pe, 0.85, 8000), (_llm, _rag, 0.82, 7000), (_llm, _dl, 0.75, 5000), (_llm, _pytorch, 0.70, 4000),
  (_rag, _pe, 0.78, 6000), (_rag, _llm, 0.82, 7000), (_rag, _nlp, 0.68, 4000),

  -- Statistics
  (_stats, _ml, 0.88, 32000), (_stats, _da, 0.80, 28000), (_stats, _python, 0.71, 25000), (_stats, _r, 0.75, 15000),

  -- TensorFlow/PyTorch
  (_tf, _pytorch, 0.70, 15000), (_tf, _ml, 0.76, 22000), (_tf, _dl, 0.80, 20000),
  (_pytorch, _tf, 0.70, 15000), (_pytorch, _ml, 0.73, 20000), (_pytorch, _dl, 0.78, 18000),

  -- Agile/Scrum
  (_agile, _scrum, 0.90, 25000), (_agile, _pm, 0.85, 25000), (_agile, _road, 0.72, 14000),
  (_scrum, _agile, 0.90, 25000),

  -- Node / React
  (_node, _js, 0.85, 32000), (_node, _rest, 0.80, 25000), (_node, _docker, 0.55, 12000),
  (_react, _js, 0.94, 40000), (_react, _ts, 0.85, 28000), (_react, _graphql, 0.62, 12000),

  -- Go adjacencies
  (_go, _docker, 0.62, 12000), (_go, _k8s, 0.55, 10000), (_go, _rest, 0.70, 14000), (_go, _linux, 0.58, 10000),

  -- Rust
  (_rust, _cpp, 0.65, 8000), (_rust, _linux, 0.55, 6000), (_rust, _sec, 0.50, 5000),

  -- Finance
  (_fin, _strat, 0.68, 12000), (_fin, _da, 0.55, 8000),

  -- MLOps
  (_mlops, _ml, 0.72, 12000), (_mlops, _docker, 0.68, 10000), (_mlops, _k8s, 0.62, 8000),
  (_mlops, _cicd, 0.65, 9000), (_mlops, _aws, 0.58, 7000)

  ON CONFLICT DO NOTHING;
END $$;


-- ===================== CAREER PATHS =====================
INSERT INTO career_paths (title, description, avg_salary_min, avg_salary_max, demand_score, growth_rate, required_skills, nice_to_have_skills) VALUES
(
  'ML Engineer',
  'Design, build, and deploy machine learning models in production systems. Bridge the gap between data science research and scalable software engineering.',
  145000, 185000, 95, 42.0,
  '["Python", "Machine Learning", "TensorFlow", "SQL", "Docker", "MLOps"]',
  '["Deep Learning", "PyTorch", "Kubernetes", "Statistics", "REST APIs"]'
),
(
  'Data Engineer',
  'Architect and maintain data pipelines, warehouses, and infrastructure that power analytics and ML at scale.',
  130000, 165000, 90, 35.0,
  '["Python", "SQL", "Apache Spark", "dbt", "AWS", "Airflow"]',
  '["Docker", "Kubernetes", "Terraform", "PostgreSQL", "Data Analysis"]'
),
(
  'Product Analytics Lead',
  'Drive product decisions through data analysis, experimentation, and insight generation. Bridge product and data teams.',
  115000, 145000, 82, 19.0,
  '["SQL", "Data Analysis", "A/B Testing", "Product Metrics", "Communication"]',
  '["Python", "Tableau", "Statistics", "Product Management", "Data Storytelling"]'
),
(
  'Cloud Architect',
  'Design and implement cloud infrastructure solutions for enterprise-scale applications.',
  155000, 200000, 92, 38.0,
  '["AWS", "Docker", "Kubernetes", "Terraform", "Security", "Networking"]',
  '["Azure", "GCP", "Linux", "CI/CD", "Microservices"]'
),
(
  'Full-Stack Engineer',
  'Build end-to-end web applications from database to deployment with modern frameworks.',
  120000, 160000, 88, 25.0,
  '["JavaScript", "TypeScript", "React", "Node.js", "SQL", "REST APIs"]',
  '["Docker", "PostgreSQL", "GraphQL", "CI/CD", "AWS"]'
),
(
  'AI Research Engineer',
  'Push the boundaries of AI capabilities through novel architectures and training methods.',
  160000, 220000, 96, 55.0,
  '["Python", "Deep Learning", "PyTorch", "Machine Learning", "Statistics", "NLP"]',
  '["TensorFlow", "Computer Vision", "LLM Fine-tuning", "RAG Systems"]'
),
(
  'DevOps Engineer',
  'Automate infrastructure, improve deployment velocity, and ensure system reliability.',
  125000, 160000, 86, 22.0,
  '["Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Bash"]',
  '["AWS", "Security", "Networking", "Python", "Microservices"]'
),
(
  'AI Product Manager',
  'Lead AI-powered product strategy, bridging business objectives with technical capabilities.',
  140000, 180000, 88, 32.0,
  '["Product Management", "Machine Learning", "Data Analysis", "Communication", "Agile"]',
  '["Prompt Engineering", "A/B Testing", "Strategy", "SQL", "User Research"]'
),
(
  'LLM/GenAI Engineer',
  'Build production applications powered by large language models, RAG systems, and AI agents.',
  155000, 210000, 97, 120.0,
  '["Python", "Prompt Engineering", "RAG Systems", "LLM Fine-tuning", "REST APIs"]',
  '["NLP", "Docker", "Vector Databases", "AI Agents", "FastAPI"]'
),
(
  'UX Engineer',
  'Bridge design and engineering — implement high-fidelity, accessible, and performant user interfaces.',
  110000, 145000, 78, 15.0,
  '["JavaScript", "React", "Figma", "UX Design", "TypeScript", "CSS"]',
  '["A/B Testing", "User Research", "Agile", "Node.js", "Communication"]'
);

-- Verify counts
DO $$
BEGIN
  RAISE NOTICE 'Skills inserted: %', (SELECT COUNT(*) FROM skills);
  RAISE NOTICE 'Adjacencies inserted: %', (SELECT COUNT(*) FROM skill_adjacency);
  RAISE NOTICE 'Career paths inserted: %', (SELECT COUNT(*) FROM career_paths);
END $$;
