require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const { generateToken } = require('./src/config/jwt');

// Admin credentials
const ADMIN_DATA = {
    name: 'Super Admin',
    email: 'superadmin@ngitraining.com',
    password: 'Admin@2026',
    role: 'admin'
};

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        console.log('🔌 Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connecté!\n');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_DATA.email });

        if (existingAdmin) {
            console.log('⚠️  Un admin avec cet email existe déjà!');
            console.log('\n📧 Email:', existingAdmin.email);
            console.log('👤 Nom:', existingAdmin.name);
            console.log('🔑 Rôle:', existingAdmin.role);

            // Generate token for existing admin
            const token = generateToken(existingAdmin._id);
            console.log('\n🎫 Token JWT généré:');
            console.log(token);

            console.log('\n📝 Utilisez ce token pour vous connecter:');
            console.log(`Authorization: Bearer ${token}`);

            await mongoose.connection.close();
            return;
        }

        // Create new admin
        console.log('👤 Création du compte admin...');
        const admin = await User.create(ADMIN_DATA);

        console.log('✅ Compte admin créé avec succès!\n');
        console.log('═══════════════════════════════════════');
        console.log('📋 INFORMATIONS DU COMPTE ADMIN');
        console.log('═══════════════════════════════════════');
        console.log('🆔 ID:', admin._id);
        console.log('👤 Nom:', admin.name);
        console.log('📧 Email:', admin.email);
        console.log('🔑 Rôle:', admin.role);
        console.log('🔐 Mot de passe:', ADMIN_DATA.password);

        // Generate JWT token
        const token = generateToken(admin._id);
        console.log('\n🎫 Token JWT:');
        console.log(token);

        console.log('\n═══════════════════════════════════════');
        console.log('🧪 TESTER L\'ACCÈS');
        console.log('═══════════════════════════════════════');

        console.log('\n1️⃣ Login via API:');
        console.log(`curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "${ADMIN_DATA.email}",
    "password": "${ADMIN_DATA.password}"
  }'`);

        console.log('\n2️⃣ Accéder aux ressources protégées:');
        console.log(`curl -X GET http://localhost:5000/api/auth/me \\
  -H "Authorization: Bearer ${token}"`);

        console.log('\n3️⃣ Créer un projet:');
        console.log(`curl -X POST http://localhost:5000/api/projects \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Mon Premier Projet",
    "description": "Description du projet",
    "status": "planning"
  }'`);

        console.log('\n═══════════════════════════════════════\n');

        // Close connection
        await mongoose.connection.close();
        console.log('✅ Connexion MongoDB fermée.');

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
};

// Run the script
createAdmin();
