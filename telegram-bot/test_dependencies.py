#!/usr/bin/env python3
# 🔱 DEPENDENCY TEST SCRIPT 🔱
# Quick verification of which requirements work

import sys
import subprocess

def test_requirements_file(filename):
    """Test if a requirements file can be installed"""
    print(f"\n🧪 Testing {filename}...")
    
    try:
        # Try dry run installation
        result = subprocess.run([
            sys.executable, '-m', 'pip', 'install', '--dry-run', '-r', filename
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print(f"✅ {filename}: COMPATIBLE")
            return True
        else:
            print(f"❌ {filename}: CONFLICTS DETECTED")
            print(f"Error: {result.stderr[:200]}...")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"⏰ {filename}: TIMEOUT (may work but slow)")
        return False
    except Exception as e:
        print(f"💥 {filename}: ERROR - {e}")
        return False

def test_core_imports():
    """Test if core packages can be imported"""
    print("\n🔍 Testing core imports...")
    
    packages = ['telegram', 'supabase', 'aiohttp', 'httpx', 'dotenv']
    success_count = 0
    
    for package in packages:
        try:
            __import__(package)
            print(f"✅ {package}: OK")
            success_count += 1
        except ImportError as e:
            print(f"❌ {package}: {e}")
    
    print(f"\n📊 Import Success Rate: {success_count}/{len(packages)}")
    return success_count == len(packages)

def main():
    """Main testing function"""
    print("🔱 BONNIE AI DEPENDENCY COMPATIBILITY TEST 🔱")
    print("=" * 50)
    
    # Test available requirements files
    requirements_files = [
        'requirements-emergency.txt',
        'requirements-backwards.txt', 
        'requirements.txt',
        'requirements-alternative.txt'
    ]
    
    compatible_files = []
    
    for req_file in requirements_files:
        try:
            with open(req_file, 'r') as f:
                if test_requirements_file(req_file):
                    compatible_files.append(req_file)
        except FileNotFoundError:
            print(f"⚠️ {req_file}: FILE NOT FOUND")
    
    # Test current environment
    current_imports_work = test_core_imports()
    
    # Results summary
    print("\n" + "=" * 50)
    print("🎯 COMPATIBILITY SUMMARY:")
    
    if compatible_files:
        print(f"✅ Compatible requirements files: {len(compatible_files)}")
        for file in compatible_files:
            print(f"   📋 {file}")
        print(f"\n🏆 RECOMMENDED: {compatible_files[0]}")
    else:
        print("❌ No requirements files are fully compatible")
        print("💡 Try running with --break-system-packages or use virtual environment")
    
    if current_imports_work:
        print("✅ Current environment has working core imports")
        print("🚀 Bot deployment should work")
    else:
        print("❌ Current environment missing core packages")
        print("🔧 Install dependencies before deployment")

if __name__ == "__main__":
    main()