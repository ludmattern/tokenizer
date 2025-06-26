#!/bin/bash

# Script d'initialisation pour MATTERN42 Token
echo "🚀 Initialisation du projet MATTERN42 Token..."

# Vérification de Node.js
if ! command -v node &>/dev/null; then
	echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
	exit 1
fi

# Vérification de npm
if ! command -v npm &>/dev/null; then
	echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
	exit 1
fi

echo "✅ Node.js et npm détectés"

# Aller dans le dossier deployment
cd deployment

echo "📦 Installation des dépendances..."
npm install

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
	echo "📝 Création du fichier .env..."
	cp .env.example .env
	echo "⚠️  N'oubliez pas de modifier le fichier .env avec vos clés !"
fi

echo "🔨 Compilation du contrat..."
npx hardhat compile

if [ $? -ne 0 ]; then
	echo "❌ Erreur lors de la compilation"
	exit 1
fi

echo "🧪 Exécution des tests..."
npx hardhat test

if [ $? -ne 0 ]; then
	echo "❌ Erreur lors des tests"
	exit 1
fi

echo "🔐 Exécution des tests multisig..."
npx hardhat test test/Multisig.test.js

echo ""
echo "✅ Initialisation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Modifiez le fichier deployment/.env avec vos clés"
echo "2. Obtenez des tokens de test sur les faucets"
echo "3. Déployez le token : cd deployment && npx hardhat run scripts/deploy-token.js --network sepolia"
echo "4. Déployez le multisig : cd deployment && npx hardhat run scripts/deploy-multisig.js --network sepolia"
echo ""
echo "📖 Documentation disponible dans le dossier documentation/"
