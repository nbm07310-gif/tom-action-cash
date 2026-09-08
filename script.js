// Sélectionner le plan
function selectPlan(planName, price, actionAmount) {
    // Traduire le nom du plan
    const planNames = {
        'classique': 'Formule Classique',
        'premium': 'Formule Premium',
        'or': 'Formule Or'
    };

    // Afficher la section paiement
    document.getElementById('payment').style.display = 'block';
    
    // Remplir les informations du plan
    document.getElementById('selectedPlanName').textContent = planNames[planName];
    document.getElementById('selectedAmount').textContent = price.toFixed(2);
    document.getElementById('selectedAction').textContent = actionAmount.toFixed(2);

    // Scroller vers la section paiement
    document.getElementById('payment').scrollIntoView({ behavior: 'smooth' });
}

// Annuler le paiement
function cancelPayment() {
    document.getElementById('payment').style.display = 'none';
    document.getElementById('paymentForm').reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Formater le numéro de carte
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = formattedValue;
        });
    }

    // Formater la date d'expiration
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Limiter le CVV
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    }
});

// Soumettre le formulaire de paiement
document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Récupérer les données du formulaire
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                postal: document.getElementById('postal').value,
                country: document.getElementById('country').value,
                cardName: document.getElementById('cardName').value,
                cardNumber: document.getElementById('cardNumber').value,
                expiry: document.getElementById('expiry').value,
                cvv: document.getElementById('cvv').value,
                username: document.getElementById('username').value,
                plan: document.getElementById('selectedPlanName').textContent,
                amount: document.getElementById('selectedAmount').textContent,
                action: document.getElementById('selectedAction').textContent
            };

            // Valider les données
            if (!validatePaymentForm(formData)) {
                return;
            }

            // Afficher le message de traitement
            showProcessingMessage();

            // Simuler le traitement du paiement (3 secondes)
            setTimeout(function() {
                // Afficher le message de succès
                showSuccessMessage(formData);
                
                // Réinitialiser le formulaire
                paymentForm.reset();
                
                // Masquer la section paiement après 5 secondes
                setTimeout(function() {
                    document.getElementById('payment').style.display = 'none';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 5000);
            }, 3000);
        });
    }
});

// Valider le formulaire
function validatePaymentForm(data) {
    // Valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('❌ Email invalide. Veuillez entrer une adresse email valide.');
        return false;
    }

    // Valider le numéro de carte (16 chiffres)
    const cardNumber = data.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNumber)) {
        alert('❌ Numéro de carte invalide. Doit contenir 16 chiffres.');
        return false;
    }

    // Valider la date d'expiration (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(data.expiry)) {
        alert('❌ Date d\'expiration invalide. Format: MM/YY');
        return false;
    }

    // Valider le CVV (3-4 chiffres)
    if (!/^\d{3,4}$/.test(data.cvv)) {
        alert('❌ CVV invalide. Doit contenir 3 ou 4 chiffres.');
        return false;
    }

    // Valider le code postal
    if (data.postal.trim() === '') {
        alert('❌ Code postal requis.');
        return false;
    }

    // Valider le nom d'utilisateur
    if (data.username.trim().length < 3) {
        alert('❌ Le nom d\'utilisateur doit contenir au moins 3 caractères.');
        return false;
    }

    // Vérifier que les conditions sont acceptées
    if (!document.getElementById('terms').checked) {
        alert('❌ Vous devez accepter les conditions d\'utilisation.');
        return false;
    }

    return true;
}

// Afficher le message de traitement
function showProcessingMessage() {
    const message = document.createElement('div');
    message.id = 'processing-message';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        text-align: center;
    `;
    message.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
        <h3 style="color: #0f172a; margin-bottom: 0.5rem;">Traitement en cours...</h3>
        <p style="color: #64748b;">Veuillez patienter, votre paiement est en cours de traitement.</p>
        <div class="spinner" style="margin-top: 1rem;">
            <div style="border: 4px solid #e2e8f0; border-top: 4px solid #22c55e; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
    `;
    document.body.appendChild(message);

    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Afficher le message de succès
function showSuccessMessage(formData) {
    const existingMessage = document.getElementById('processing-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.id = 'success-message';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        text-align: center;
        max-width: 500px;
    `;
    message.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
        <h3 style="color: #22c55e; margin-bottom: 0.5rem;">Paiement Réussi!</h3>
        <p style="color: #64748b; margin-bottom: 1rem;">Votre paiement a été traité avec succès.</p>
        
        <div style="background: #f0fdf4; padding: 1.5rem; border-radius: 8px; text-align: left; margin: 1.5rem 0; border-left: 4px solid #22c55e;">
            <p style="margin: 0.5rem 0; color: #475569;"><strong>Plan:</strong> ${formData.plan}</p>
            <p style="margin: 0.5rem 0; color: #475569;"><strong>Montant:</strong> ${formData.amount}€/mois</p>
            <p style="margin: 0.5rem 0; color: #475569;"><strong>Nom d'utilisateur:</strong> ${formData.username}</p>
            <p style="margin: 0.5rem 0; color: #475569;"><strong>Email:</strong> ${formData.email}</p>
        </div>
        
        <p style="color: #475569; font-size: 0.9rem; margin: 1rem 0;">
            📧 Un email de confirmation avec vos identifiants de connexion a été envoyé à <strong>${formData.email}</strong>
        </p>
        
        <p style="color: #475569; font-size: 0.9rem; margin: 1rem 0;">
            🚀 Vos actions automatiques commenceront dans 24h (toutes les 2h45)
        </p>
    `;
    document.body.appendChild(message);
}

// Ajouter un overlay au message
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.innerHTML = `
        #processing-message::before,
        #success-message::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: -1;
        }
    `;
    document.head.appendChild(style);
});

// Smooth scroll pour les liens
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Ajouter une animation au scroll
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Initialiser l'animation des cartes
document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.3s ease';
});