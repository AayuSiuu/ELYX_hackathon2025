import json
import pandas as pd
from datetime import datetime, timedelta
import re

def prepare_finetuning_dataset(json_file_path):
    """
    Prepare fine-tuning dataset from Rohan's health journey conversations
    """
    
    # Load the conversation data
    with open(json_file_path, 'r') as f:
        data = json.load(f)
    
    # Extract conversations and create training examples
    training_examples = []
    
    # Add system context
    system_context = """You are Advik, an AI Performance Scientist specializing in health analytics and personalized medicine. You have access to Rohan Patel's complete 8-month health transformation journey with Elyx Health. You can analyze biomarkers, provide insights on sleep, stress, nutrition, exercise, and travel adaptations. You speak with expertise but in a friendly, data-driven manner."""
    
    # Process weekly conversations
    conversations = data.get('conversations_by_week', {})
    
    for week_key, week_data in conversations.items():
        week_num = int(week_key.replace('week_', ''))
        phase = week_data.get('phase', '')
        messages = week_data.get('messages', [])
        
        # Create conversation context
        for i, message in enumerate(messages):
            if message['role'] == 'member':  # Rohan's messages
                # Look for follow-up responses from team
                responses = []
                for j in range(i+1, min(i+4, len(messages))):
                    if messages[j]['role'] != 'member':
                        responses.append(messages[j])
                
                if responses:
                    # Create training example
                    context = f"Week {week_num} - {phase}\n"
                    context += f"Date: {message['date']}\n"
                    
                    # Add previous context if available
                    if i > 0:
                        prev_msg = messages[i-1]
                        context += f"Previous: {prev_msg['sender']}: {prev_msg['message']}\n"
                    
                    user_input = message['message']
                    
                    # Combine team responses
                    assistant_response = ""
                    for resp in responses:
                        if resp['role'] in ['scientist', 'doctor', 'nutritionist', 'pt', 'concierge']:
                            assistant_response += f"{resp['sender']}: {resp['message']}\n\n"
                    
                    if assistant_response.strip():
                        training_examples.append({
                            "messages": [
                                {"role": "system", "content": system_context},
                                {"role": "user", "content": f"Context: {context}\nRohan's question/comment: {user_input}"},
                                {"role": "assistant", "content": assistant_response.strip()}
                            ]
                        })
    
    # Add Q&A examples based on key insights
    key_insights = [
        {
            "question": "How did Rohan achieve his HbA1c improvement from 6.2% to 5.1%?",
            "answer": "Rohan's HbA1c transformation was achieved through a multi-faceted approach: 1) CGM-guided nutrition optimization that helped him understand glucose responses to different foods, 2) Stress management protocols including breathing exercises at optimal times (10 AM, 2 PM, 6 PM) which reduced stress-glucose correlation from 0.73, 3) Consistent exercise routine with 156 total sessions, 4) Sleep optimization that improved efficiency from 68% to 83%, and 5) Real-time data adjustments by our care team. The key was the personalized, data-driven approach that adapted to his lifestyle."
        },
        {
            "question": "What was Rohan's stress-glucose correlation and how was it managed?",
            "answer": "We discovered a significant stress-glucose correlation coefficient of 0.73 in Rohan's data, meaning his emotional state strongly impacted his metabolic function. We implemented a targeted 5-minute breathing protocol during high-stress periods, optimally timed at 10 AM, 2 PM, and 6 PM based on his HRV patterns. This intervention reduced stress-induced glucose spikes by 15-20%. The real-time CGM data allowed Rohan to literally see how work pressure affected his body, creating powerful behavioral feedback loops."
        },
        {
            "question": "How did travel adaptations work for Rohan's health journey?",
            "answer": "Rohan's travel optimization was remarkable. For Singapore (+7 hours), we implemented sleep shifting 30 minutes earlier for 3 days pre-departure, light therapy protocols, and in-flight movement every 90 minutes, resulting in 67% faster recovery than predicted. For Dubai, we addressed heat stress with extra hydration (500ml/day), exercise timing adjustments, and 150% increased electrolyte supplementation. Tokyo (+8.5 hours) required meal timing strategy and Japanese diet integration, which actually improved his glucose variability by 31%. His jet lag recovery time improved 40% overall during the journey."
        },
        {
            "question": "What were Rohan's final health transformation results?",
            "answer": "Rohan's 8-month transformation results were extraordinary: Weight loss of 9.2kg, HbA1c improved from 6.2% to 5.1% (reversing pre-diabetes), RHR decreased from 72 to 58 bpm (-19%), HRV increased from 28 to 47ms (+68%), sleep efficiency improved from 68% to 83% (+15%), blood pressure optimized to 118/75, and biological age regression of 3.4 years. With 67% average adherence across 32 weeks, 1,247 team interactions, and 156 workout sessions, he achieved elite athlete-level recovery metrics."
        },
        {
            "question": "What role did wearable data play in Rohan's optimization?",
            "answer": "Wearable data was central to Rohan's success. I analyzed his Garmin Fenix 7 data continuously, tracking RHR, HRV, sleep architecture, stress scores, and recovery metrics. Key insights included: exercise timing optimization (4-6 PM workouts correlated with 22% better sleep), detection of overtraining through HRV decreases, circadian rhythm optimization for travel, and stress pattern identification. The data revealed that post-workout HRV increased 18% within 2 hours, and we used this to optimize his training schedule. Real-time feedback created powerful behavior modification loops."
        }
    ]
    
    # Add the Q&A examples
    for insight in key_insights:
        training_examples.append({
            "messages": [
                {"role": "system", "content": system_context},
                {"role": "user", "content": insight["question"]},
                {"role": "assistant", "content": insight["answer"]}
            ]
        })
    
    # Add milestone and summary examples
    milestones = data.get('key_milestones', [])
    for milestone in milestones:
        if 'achievements' in milestone:
            question = f"What were the key achievements in week {milestone['week']}?"
            answer = f"Week {milestone['week']} - {milestone['title']}: "
            answer += "Key achievements: " + ", ".join(milestone['achievements'])
            if 'biomarkers' in milestone:
                answer += f". Biomarker status: {milestone['biomarkers']}"
            
            training_examples.append({
                "messages": [
                    {"role": "system", "content": system_context},
                    {"role": "user", "content": question},
                    {"role": "assistant", "content": answer}
                ]
            })
    
    return training_examples

def save_training_data(training_examples, output_file='rohan_health_training.jsonl'):
    """Save training examples in JSONL format for OpenAI fine-tuning"""
    with open(output_file, 'w') as f:
        for example in training_examples:
            f.write(json.dumps(example) + '\n')
    
    print(f"Saved {len(training_examples)} training examples to {output_file}")
    return output_file

def validate_training_data(file_path):
    """Validate the training data format"""
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    valid_examples = 0
    for i, line in enumerate(lines):
        try:
            example = json.loads(line)
            if 'messages' in example and len(example['messages']) >= 2:
                valid_examples += 1
            else:
                print(f"Invalid example at line {i+1}")
        except json.JSONDecodeError:
            print(f"JSON decode error at line {i+1}")
    
    print(f"Validated {valid_examples}/{len(lines)} examples")
    return valid_examples

# Usage example
if __name__ == "__main__":
    # Prepare the dataset
    training_data = prepare_finetuning_dataset('elyx_journey_json.json')
    
    # Save training data
    output_file = save_training_data(training_data)
    
    # Validate the data
    validate_training_data(output_file)
    
    print("\nDataset preparation complete!")
    print(f"Total training examples: {len(training_data)}")
    print("Ready for OpenAI fine-tuning!")
