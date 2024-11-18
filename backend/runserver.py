#-----------------------------------------------------------------------
# runserver.py
# Runs Campus Hunt application
#-----------------------------------------------------------------------
import sys
import os
from server import app
#-----------------------------------------------------------------------

# Runs the server on the specified port, which in turn runs application
# When executed with -h as a command-line argument, displays a help message
def main():
    # Get port from command line arg or environment variable (for Render)
    port = int(os.environ.get("PORT", 10000))  # Changed default port to 10000
    
    try:
        app.run(host='0.0.0.0', port=port, debug=True)  # Explicitly binding to 0.0.0.0
    except Exception as ex:
        print(ex, file=sys.stderr)
        sys.exit(1)

#-----------------------------------------------------------------------

if __name__ == '__main__':
    main()
