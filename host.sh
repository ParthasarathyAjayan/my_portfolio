#!/bin/bash

# ============================================================================
# Portfolio Local Server Script
# ============================================================================
# This script performs pre-checks and hosts the portfolio application locally
# ============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default port
PORT=${1:-8000}

# ============================================================================
# Helper Functions
# ============================================================================

print_header() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}              Portfolio Local Server                           ${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# ============================================================================
# Pre-checks
# ============================================================================

run_prechecks() {
    echo -e "${YELLOW}Running Pre-checks...${NC}"
    echo ""
    
    local checks_passed=0
    local checks_total=0
    
    # Check 1: Verify we're in the correct directory
    ((checks_total++))
    if [ -f "index.html" ]; then
        print_success "index.html found"
        ((checks_passed++))
    else
        print_error "index.html not found. Please run this script from the portfolio directory."
        exit 1
    fi
    
    # Check 2: Verify style.css exists
    ((checks_total++))
    if [ -f "style.css" ]; then
        print_success "style.css found"
        ((checks_passed++))
    else
        print_warning "style.css not found"
    fi
    
    # Check 3: Verify script.js exists
    ((checks_total++))
    if [ -f "script.js" ]; then
        print_success "script.js found"
        ((checks_passed++))
    else
        print_warning "script.js not found"
    fi
    
    # Check 4: Verify logos directory exists
    ((checks_total++))
    if [ -d "logos" ]; then
        print_success "logos directory found"
        ((checks_passed++))
    else
        print_warning "logos directory not found"
    fi
    
    # Check 5: Verify port is available
    ((checks_total++))
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_error "Port $PORT is already in use"
        echo ""
        print_info "Try running with a different port: ./host.sh 8080"
        exit 1
    else
        print_success "Port $PORT is available"
        ((checks_passed++))
    fi
    
    echo ""
    echo -e "${GREEN}Pre-checks completed: $checks_passed/$checks_total passed${NC}"
    echo ""
}

# ============================================================================
# Server Detection and Launch
# ============================================================================

detect_and_start_server() {
    echo -e "${YELLOW}Detecting available HTTP server...${NC}"
    echo ""
    
    # Try Python 3 first (most common on macOS)
    if command -v python3 &> /dev/null; then
        print_success "Python 3 detected"
        start_python3_server
        return 0
    fi
    
    # Try Python 2
    if command -v python &> /dev/null; then
        PYTHON_VERSION=$(python -c 'import sys; print(sys.version_info[0])')
        if [ "$PYTHON_VERSION" = "2" ]; then
            print_success "Python 2 detected"
            start_python2_server
            return 0
        else
            print_success "Python detected"
            start_python3_server
            return 0
        fi
    fi
    
    # Try Node.js with npx serve
    if command -v npx &> /dev/null; then
        print_success "Node.js (npx) detected"
        start_npx_server
        return 0
    fi
    
    # Try http-server (Node.js)
    if command -v http-server &> /dev/null; then
        print_success "http-server detected"
        start_http_server
        return 0
    fi
    
    # Try PHP built-in server
    if command -v php &> /dev/null; then
        print_success "PHP detected"
        start_php_server
        return 0
    fi
    
    # Try Ruby WEBrick
    if command -v ruby &> /dev/null; then
        print_success "Ruby detected"
        start_ruby_server
        return 0
    fi
    
    # No server found
    print_error "No suitable HTTP server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: brew install python3"
    echo "  - Node.js: brew install node"
    echo "  - PHP: brew install php"
    echo "  - Ruby: (usually pre-installed on macOS)"
    exit 1
}

# ============================================================================
# Server Start Functions
# ============================================================================

print_server_info() {
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Server is running!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${CYAN}Local:${NC}   http://localhost:$PORT"
    echo -e "  ${CYAN}Network:${NC} http://$(ipconfig getifaddr en0 2>/dev/null || echo "N/A"):$PORT"
    echo ""
    echo -e "  ${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

start_python3_server() {
    print_info "Starting Python 3 HTTP server on port $PORT..."
    print_server_info
    python3 -m http.server $PORT
}

start_python2_server() {
    print_info "Starting Python 2 HTTP server on port $PORT..."
    print_server_info
    python -m SimpleHTTPServer $PORT
}

start_npx_server() {
    print_info "Starting npx serve on port $PORT..."
    print_server_info
    npx serve -l $PORT
}

start_http_server() {
    print_info "Starting http-server on port $PORT..."
    print_server_info
    http-server -p $PORT
}

start_php_server() {
    print_info "Starting PHP built-in server on port $PORT..."
    print_server_info
    php -S localhost:$PORT
}

start_ruby_server() {
    print_info "Starting Ruby WEBrick server on port $PORT..."
    print_server_info
    ruby -run -e httpd . -p $PORT
}

# ============================================================================
# Main Execution
# ============================================================================

main() {
    # Change to the script's directory
    cd "$(dirname "$0")" || exit 1
    
    # Print header
    print_header
    
    # Run pre-checks
    run_prechecks
    
    # Detect and start server
    detect_and_start_server
}

# Handle Ctrl+C gracefully
trap 'echo ""; print_info "Server stopped."; exit 0' INT

# Run main function
main
