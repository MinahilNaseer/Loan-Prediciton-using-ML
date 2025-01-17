from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import math

app = Flask(__name__)


model = joblib.load('Random_Forest_model.pkl')

import pandas as pd  

loan_entries = []


def preprocess_input(data):
    """
    Preprocess input data by applying transformations to match the trained model's features.
    """
    
    data['ApplicantIncomelog'] = math.log(data['ApplicantIncome']) if data['ApplicantIncome'] > 0 else 0
    data['LoanAmountLog'] = math.log(data['LoanAmount']) if data['LoanAmount'] > 0 else 0
    data['Loan_Amount_Term_log'] = math.log(data['LoanTerm']) if data['LoanTerm'] > 0 else 0
    data['Total_Applicant_Income_log'] = math.log(data['ApplicantIncome'] + data['CoapplicantIncome']) if (data['ApplicantIncome'] + data['CoapplicantIncome']) > 0 else 0

    
    feature_names = [
        'Gender', 'Married', 'Dependents', 'Education', 'Self_Employed',
        'Credit_History', 'Property_Area', 'ApplicantIncomelog',
        'LoanAmountLog', 'Loan_Amount_Term_log', 'Total_Applicant_Income_log'
    ]

    return pd.DataFrame([[
        data['Gender'],
        data['Married'],
        data['Dependents'],
        data['Education'],
        data['Self_Employed'],  
        data['Credit_History'],  
        data['Property_Area'],  
        data['ApplicantIncomelog'],
        data['LoanAmountLog'],
        data['Loan_Amount_Term_log'],
        data['Total_Applicant_Income_log']
    ]], columns=feature_names)



@app.route('/', methods=['GET'])
def home():
    """
    Renders the home page with the loan application form.
    """
    return render_template('main.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = {
            'ApplicantIncome': float(request.form['applicantIncome']),
            'CoapplicantIncome': float(request.form['coapplicantIncome']),
            'LoanAmount': float(request.form['loanAmount']),
            'LoanTerm': float(request.form['loanTerm']),
            'Credit_History': int(request.form['creditHistory']),
            'Gender': 1 if request.form['gender'] == 'Male' else 0,
            'Married': 1 if request.form['married'] == 'Yes' else 0,
            'Dependents': int(request.form['dependents'].replace('+', '')),
            'Education': 1 if request.form['education'] == 'Graduate' else 0,
            'Self_Employed': 1 if request.form['selfEmployed'] == 'Yes' else 0,
            'Property_Area': {'Urban': 2, 'Semiurban': 1, 'Rural': 0}[request.form['propertyArea']],
            'Name': request.form['name']
        }

        input_data = preprocess_input(data)
        prediction = model.predict(input_data)[0]
        result = 'Approved' if prediction == 1 else 'Rejected'

        loan_entries.append({
            'name': data['Name'],
            'applicant_income': data['ApplicantIncome'],
            'coapplicant_income': data['CoapplicantIncome'],
            'loan_amount': data['LoanAmount'],
            'loan_term': data['LoanTerm'],
            'credit_history': data['Credit_History'],
            'prediction': result
        })

        return jsonify({"message": result})
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"})



@app.route('/applied', methods=['GET'])
def applied():
    return render_template('applied.html', loan_entries=loan_entries)


@app.route('/loan-status', methods=['GET'])
def loan_status():
    """
    Renders the loan status page with a dynamic table for loan details.
    """
    return render_template('loan_status.html')

if __name__ == '__main__':
    app.run(debug=True)
