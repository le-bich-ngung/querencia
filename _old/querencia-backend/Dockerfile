# Dùng Python 3.11 làm nền tảng
FROM python:3.11-slim

# Thư mục làm việc trong container
WORKDIR /app

# Copy file requirements trước để tận dụng cache
COPY requirements.txt .

# Cài thư viện
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code vào container
COPY . .

# Chạy FastAPI trên cổng 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]