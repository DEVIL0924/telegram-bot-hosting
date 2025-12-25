from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud
from database import SessionLocal, engine
import uuid
import subprocess
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Telegram Bot Hosting API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/users/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@app.post("/api/bots/create", response_model=schemas.Bot)
def create_bot(bot: schemas.BotCreate, db: Session = Depends(get_db)):
    bot_token = str(uuid.uuid4())
    return crud.create_bot(db=db, bot=bot, bot_token=bot_token)

@app.post("/api/bots/{bot_id}/deploy")
def deploy_bot(bot_id: int, db: Session = Depends(get_db)):
    bot = crud.get_bot(db, bot_id)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    
    # Start bot process based on language
    if bot.language == "python":
        process = subprocess.Popen(
            ["python", f"bots/{bot.bot_token}/main.py"],
            cwd=os.path.dirname(__file__)
        )
    elif bot.language == "php":
        process = subprocess.Popen(
            ["php", f"bots/{bot.bot_token}/bot.php"],
            cwd=os.path.dirname(__file__)
        )
    
    crud.update_bot_status(db, bot_id, "running")
    return {"message": "Bot deployed successfully"}
