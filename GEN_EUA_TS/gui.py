import tkinter as tk
import time

def start_countdown():
    global running
    running = True
    seconds = int(entry.get())
    while running and seconds > 0:
        mins, secs = divmod(seconds, 60)
        timer = '{:02d}:{:02d}'.format(mins, secs)
        label.config(text=timer)
        time.sleep(1)
        seconds -= 1
    if running:
        label.config(text="Countdown complete!")

def stop_countdown():
    global running
    running = False

root = tk.Tk()
root.title("Countdown Timer")

label = tk.Label(root, text="Enter time in seconds:")
label.pack()

entry = tk.Entry(root)
entry.pack()

start_button = tk.Button(root, text="Start", command=start_countdown)
start_button.pack()

stop_button = tk.Button(root, text="Stop", command=stop_countdown)
stop_button.pack()

root.mainloop()