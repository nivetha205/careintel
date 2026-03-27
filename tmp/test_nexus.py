import asyncio
import os
import sys
from dotenv import load_dotenv

# Add current directory to path
sys.path.append(os.getcwd())

from backend.services.llm_service import LLMService

async def main():
    load_dotenv()
    print("Testing Agentic Nexus...")
    try:
        result = await LLMService.analyze_patient_data(
            "Patient age 70, glucose 150, BP 145/90. History of heart surgery. Using Metformin.",
            current_meds=["Metformin 500mg"],
            lifestyle={"activity": "Low", "diet": "Keto"}
        )
        print("Success! Nexus returned:")
        import json
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"FAILED: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
