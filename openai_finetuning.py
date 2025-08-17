import openai
import json
import time
from openai import OpenAI

class RohanHealthFineTuner:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)
    
    def upload_training_file(self, file_path):
        """Upload training file to OpenAI"""
        print("Uploading training file...")
        
        with open(file_path, 'rb') as f:
            response = self.client.files.create(
                file=f,
                purpose='fine-tune'
            )
        
        file_id = response.id
        print(f"File uploaded successfully. File ID: {file_id}")
        return file_id
    
    def create_fine_tuning_job(self, file_id, model="gpt-3.5-turbo"):
        """Create fine-tuning job"""
        print(f"Creating fine-tuning job with model: {model}")
        
        response = self.client.fine_tuning.jobs.create(
            training_file=file_id,
            model=model,
            hyperparameters={
                "n_epochs": 3,  # Adjust based on your data size
                "batch_size": 1,
                "learning_rate_multiplier": 0.1
            }
        )
        
        job_id = response.id
        print(f"Fine-tuning job created. Job ID: {job_id}")
        return job_id
    
    def monitor_fine_tuning(self, job_id):
        """Monitor fine-tuning progress"""
        print("Monitoring fine-tuning progress...")
        
        while True:
            response = self.client.fine_tuning.jobs.retrieve(job_id)
            status = response.status
            
            print(f"Status: {status}")
            
            if status == "succeeded":
                model_id = response.fine_tuned_model
                print(f"Fine-tuning completed! Model ID: {model_id}")
                return model_id
            elif status == "failed":
                print("Fine-tuning failed!")
                return None
            
            time.sleep(30)  # Check every 30 seconds
    
    def test_fine_tuned_model(self, model_id):
        """Test the fine-tuned model"""
        test_questions = [
            "How did Rohan's HbA1c improve during his journey?",
            "What was the stress-glucose correlation discovered in Rohan's data?",
            "How did travel adaptations work for Rohan?",
            "What were Rohan's sleep optimization strategies?"
        ]
        
        print("\nTesting fine-tuned model:")
        print("=" * 50)
        
        for question in test_questions:
            response = self.client.chat.completions.create(
                model=model_id,
                messages=[
                    {"role": "user", "content": question}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            answer = response.choices[0].message.content
            print(f"Q: {question}")
            print(f"A: {answer}\n")
            print("-" * 50)

def main():
    # Initialize with your OpenAI API key
    api_key = "your-openai-api-key-here"  # Replace with actual key
    
    fine_tuner = RohanHealthFineTuner(api_key)
    
    # Step 1: Upload training file
    file_id = fine_tuner.upload_training_file("rohan_health_training.jsonl")
    
    # Step 2: Create fine-tuning job
    job_id = fine_tuner.create_fine_tuning_job(file_id)
    
    # Step 3: Monitor progress
    model_id = fine_tuner.monitor_fine_tuning(job_id)
    
    if model_id:
        # Step 4: Test the model
        fine_tuner.test_fine_tuned_model(model_id)
        
        print(f"\nYour fine-tuned model is ready!")
        print(f"Model ID: {model_id}")
        print("You can now use this model in your chatbot.")
    
    return model_id

if __name__ == "__main__":
    model_id = main()
