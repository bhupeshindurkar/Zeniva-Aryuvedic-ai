import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return

        self.saveState()
        
        # Header line
        self.setStrokeColor(colors.HexColor("#065F46"))
        self.setLineWidth(0.75)
        self.line(40, letter[1] - 40, letter[0] - 40, letter[1] - 40)
        
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#065F46"))
        self.drawString(40, letter[1] - 34, "ZENIVA AI — NEW USER RUN COMMAND GUIDE")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#6B7280"))
        self.drawRightString(letter[0] - 40, letter[1] - 34, "Step-by-Step Setup in VS Code Terminal")
        
        # Footer line
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.setLineWidth(0.75)
        self.line(40, 42, letter[0] - 40, 42)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#6B7280"))
        self.drawString(40, 28, "Zeniva AI Healthcare Platform • Beginner & Developer Manual")
        
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 40, 28, page_text)
        
        self.restoreState()


def build_guide_pdf(output_filename):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Brand Colors
    PRIMARY = colors.HexColor("#064E3B")    # Emerald
    SECONDARY = colors.HexColor("#047857")  # Green
    ACCENT = colors.HexColor("#B45309")     # Amber Gold
    CODE_BG = colors.HexColor("#1E293B")    # Dark slate code box
    CODE_TEXT = colors.HexColor("#38BDF8")  # Cyan for code
    BG_LIGHT = colors.HexColor("#F8FAFC")   # Light gray
    ACCENT_LIGHT = colors.HexColor("#ECFDF5")
    BORDER_COLOR = colors.HexColor("#CBD5E1")
    ALERT_BG = colors.HexColor("#FEF3C7")   # Warm yellow
    ALERT_BORDER = colors.HexColor("#F59E0B")

    # Typography
    styles.add(ParagraphStyle(
        'MainTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        alignment=1,
        spaceAfter=6
    ))

    styles.add(ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=ACCENT,
        alignment=1,
        spaceAfter=15
    ))

    styles.add(ParagraphStyle(
        'StepHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'StepSubHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=SECONDARY,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        'BodyTxt',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=14,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=6
    ))

    styles.add(ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=9.5,
        leading=14,
        textColor=CODE_TEXT
    ))

    styles.add(ParagraphStyle(
        'PromptTxt',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#94A3B8")
    ))

    styles.add(ParagraphStyle(
        'TableHead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    ))

    styles.add(ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1F2937")
    ))

    story = []

    # =========================================================================
    # HEADER & HERO BANNER
    # =========================================================================
    story.append(Paragraph("ZENIVA AI", styles['MainTitle']))
    story.append(Paragraph("NEW USER QUICK-START & RUN COMMAND MANUAL", styles['SubTitle']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceBefore=4, spaceAfter=14))

    # User's exact prompt callout
    user_prompt_box = """
    <b>You are currently at this prompt in VS Code PowerShell:</b><br/>
    <font color='#F59E0B'><b>PS C:\\Users\\bhupe\\Downloads\\zeniva-ai---ayurvedic-&-clinical-rag-healthcare-assistant&gt;</b></font><br/><br/>
    Follow this exact step-by-step sequence to run both the <b>FastAPI Backend</b> and <b>Vite React Frontend</b>.
    """
    p_data = [[Paragraph(user_prompt_box, styles['BodyTxt'])]]
    p_table = Table(p_data, colWidths=[530])
    p_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), ALERT_BG),
        ('BOX', (0, 0), (-1, -1), 1.5, ALERT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(p_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # STEP 0: PREREQUISITES CHECK
    # =========================================================================
    story.append(Paragraph("Step 0: Verify Software Installed on Your PC (One-Time)", styles['StepHeading']))
    story.append(Paragraph("Type these two commands to confirm you have <b>Python</b> and <b>Node.js</b> installed:", styles['BodyTxt']))

    cmd_box_0 = [
        [Paragraph("<font color='#A7F3D0'># 1. Check Python version (requires Python 3.10 or 3.11+)</font><br/>python --version<br/><br/><font color='#A7F3D0'># 2. Check Node.js version (requires Node 18+ or 20+)</font><br/>node -v", styles['CodeSnippet'])]
    ]
    t0 = Table(cmd_box_0, colWidths=[530])
    t0.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CODE_BG),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(t0)
    story.append(Spacer(1, 10))

    # =========================================================================
    # STEP 1: ONE-TIME DEPENDENCY INSTALLATION
    # =========================================================================
    story.append(Paragraph("Step 1: Install Dependencies (Only Needed the First Time)", styles['StepHeading']))
    story.append(Paragraph("Agar aapne project pehli baar download kiya hai, toh ye commands ek baar run karein:", styles['BodyTxt']))

    cmd_box_1 = [
        [Paragraph(
            "<font color='#94A3B8'>PS C:\\...\\zeniva-ai&gt;</font> <font color='#FBBF24'>pip install -r backend/requirements.txt</font><br/>"
            "<font color='#A7F3D0'># This installs FastAPI, Uvicorn, Pydantic, Requests, and ReportLab</font><br/><br/>"
            "<font color='#94A3B8'>PS C:\\...\\zeniva-ai&gt;</font> <font color='#FBBF24'>cd frontend ; npm install ; cd ..</font><br/>"
            "<font color='#A7F3D0'># This installs all React, Vite, and Tailwind packages</font>",
            styles['CodeSnippet']
        )]
    ]
    t1 = Table(cmd_box_1, colWidths=[530])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CODE_BG),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(t1)
    story.append(Spacer(1, 10))

    # =========================================================================
    # STEP 2: RUN BACKEND (TERMINAL 1)
    # =========================================================================
    story.append(Paragraph("Step 2: Start Backend Server (In Terminal 1)", styles['StepHeading']))
    story.append(Paragraph("Apne current VS Code PowerShell me ye command copy-paste karein aur Enter dabayein:", styles['BodyTxt']))

    cmd_box_2 = [
        [Paragraph(
            "<font color='#94A3B8'>PS C:\\...\\zeniva-ai&gt;</font> <font color='#38BDF8'><b>python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload</b></font>",
            styles['CodeSnippet']
        )]
    ]
    t2 = Table(cmd_box_2, colWidths=[530])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CODE_BG),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(t2)

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>✅ What You Will See in Terminal 1 (Success):</b>", styles['StepSubHeading']))
    story.append(Paragraph("<code>INFO: Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)<br/>INFO: Application startup complete.</code>", styles['BodyTxt']))
    story.append(Paragraph("<i>Is terminal ko band mat karein! Isko chalta rehne dein.</i>", styles['BodyTxt']))

    story.append(Spacer(1, 10))

    # =========================================================================
    # STEP 3: OPEN SECOND TERMINAL & RUN FRONTEND (TERMINAL 2)
    # =========================================================================
    story.append(Paragraph("Step 3: Open Second Terminal & Start Frontend (Terminal 2)", styles['StepHeading']))
    story.append(Paragraph(
        "VS Code me top menu me jaakar <b>Terminal &gt; New Terminal</b> par click karein (ya keyboard shortcut <b>Ctrl + Shift + `</b> dabayein). "
        "Ek naya terminal open ho jayega. Waha par ye type karein:",
        styles['BodyTxt']
    ))

    cmd_box_3 = [
        [Paragraph(
            "<font color='#94A3B8'>PS C:\\...\\zeniva-ai&gt;</font> <font color='#38BDF8'><b>npm run dev</b></font>",
            styles['CodeSnippet']
        )]
    ]
    t3 = Table(cmd_box_3, colWidths=[530])
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CODE_BG),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#0F172A")),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(t3)

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>✅ What You Will See in Terminal 2 (Success):</b>", styles['StepSubHeading']))
    story.append(Paragraph("<code>VITE v8.2.2 ready in 450 ms<br/>➜ Local: http://localhost:5173/<br/>➜ Network: use --host to expose</code>", styles['BodyTxt']))

    story.append(PageBreak())

    # =========================================================================
    # STEP 4: OPEN IN BROWSER
    # =========================================================================
    story.append(Paragraph("Step 4: Open Website in Google Chrome or Edge", styles['StepHeading']))
    story.append(Paragraph("Apna browser open karein aur address bar me ye link daaliye:", styles['BodyTxt']))

    url_table_data = [
        [Paragraph("Portal / Page", styles['TableHead']), Paragraph("Exact URL to Open in Browser", styles['TableHead']), Paragraph("Purpose", styles['TableHead'])],
        [Paragraph("<b>Main Web Application</b>", styles['TableCell']), Paragraph("<font color='#047857'><b>http://localhost:5173</b></font>", styles['TableCell']), Paragraph("Full Patient, Doctor & Admin Interface", styles['TableCell'])],
        [Paragraph("<b>Interactive Swagger Docs</b>", styles['TableCell']), Paragraph("<font color='#047857'><b>http://127.0.0.1:8000/docs</b></font>", styles['TableCell']), Paragraph("Test all backend APIs & SQLite database directly", styles['TableCell'])],
        [Paragraph("<b>System Summary PDF</b>", styles['TableCell']), Paragraph("<font color='#047857'><b>http://localhost:5173/Zeniva_AI_System_Summary.pdf</b></font>", styles['TableCell']), Paragraph("Direct downloadable platform architecture PDF", styles['TableCell'])],
    ]
    t_url = Table(url_table_data, colWidths=[130, 230, 170])
    t_url.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
    ]))
    story.append(t_url)
    story.append(Spacer(1, 14))

    # =========================================================================
    # STEP 5: HOW TO LOGIN (CREDENTIALS)
    # =========================================================================
    story.append(Paragraph("Step 5: Login Credentials for All 3 Roles", styles['StepHeading']))
    story.append(Paragraph("Website open hone ke baad aap kisi bhi role se login kar sakte hain:", styles['BodyTxt']))

    roles_data = [
        [Paragraph("User Role", styles['TableHead']), Paragraph("How to Access / Credentials", styles['TableHead']), Paragraph("Special Notes", styles['TableHead'])],
        [
            Paragraph("<b>1. Patient Login</b>", styles['TableCell']),
            Paragraph("Enter any 10-digit mobile (e.g. <b>9876543210</b>). Enter received OTP or click <b>Demo Auto-Fill</b>.", styles['TableCell']),
            Paragraph("Creates active patient profile with Prakriti, Pranayama breathing card & OPD queue.", styles['TableCell'])
        ],
        [
            Paragraph("<b>2. Doctor Login</b>", styles['TableCell']),
            Paragraph("Click Doctor tab &gt; Enter phone number (e.g. <b>8766903403</b>) &gt; Click <b>Register as Doctor</b> if new.", styles['TableCell']),
            Paragraph("Fill Council Reg No (MCIM), upload degree, and see countdown screen / verified OPD desk.", styles['TableCell'])
        ],
        [
            Paragraph("<b>3. Super Admin</b>", styles['TableCell']),
            Paragraph("Click Admin tab &gt; Username: <b>bhupesh_admin</b><br/>Password: <font color='#B45309'><b>bhupesh@123</b></font>", styles['TableCell']),
            Paragraph("Unlocks all 20 Governance subpages, Doctor approvals, Video broadcasts, and Audit Logs.", styles['TableCell'])
        ],
    ]
    t_roles = Table(roles_data, colWidths=[110, 240, 180])
    t_roles.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
    ]))
    story.append(t_roles)
    story.append(Spacer(1, 14))

    # =========================================================================
    # STEP 6: TROUBLESHOOTING COMMON ERRORS
    # =========================================================================
    story.append(Paragraph("Step 6: Troubleshooting & Common Fixes", styles['StepHeading']))
    
    trouble_data = [
        [Paragraph("Error Encountered", styles['TableHead']), Paragraph("Cause", styles['TableHead']), Paragraph("Exact Command to Fix", styles['TableHead'])],
        [
            Paragraph("<b>Execution Policy Error</b><br/><i>scripts is disabled on this system</i>", styles['TableCell']),
            Paragraph("Windows PowerShell default security restriction", styles['TableCell']),
            Paragraph("Run in PowerShell as Administrator:<br/><code>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code>", styles['TableCell'])
        ],
        [
            Paragraph("<b>Port 8000 already in use</b>", styles['TableCell']),
            Paragraph("Purana backend background me run ho raha hai", styles['TableCell']),
            Paragraph("Run command:<br/><code>Get-Process python | Stop-Process -Force</code><br/>Fir backend dubara start karein.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Port 5173 already in use</b>", styles['TableCell']),
            Paragraph("Vite dev server pehle se chal raha hai", styles['TableCell']),
            Paragraph("Run command:<br/><code>Get-Process node | Stop-Process -Force</code><br/>Fir `npm run dev` karein.", styles['TableCell'])
        ],
        [
            Paragraph("<b>ModuleNotFoundError: uvicorn</b>", styles['TableCell']),
            Paragraph("Python packages install nahi hue hain", styles['TableCell']),
            Paragraph("Run command:<br/><code>pip install -r backend/requirements.txt</code>", styles['TableCell'])
        ],
    ]
    t_trouble = Table(trouble_data, colWidths=[150, 140, 240])
    t_trouble.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#334155")),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
    ]))
    story.append(t_trouble)
    story.append(Spacer(1, 15))

    # Bottom summary box
    bottom_box = """
    <b>Summary Checklist:</b><br/>
    1. <b>Terminal 1:</b> <code>python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload</code><br/>
    2. <b>Terminal 2:</b> <code>npm run dev</code><br/>
    3. <b>Browser:</b> Open <code>http://localhost:5173</code><br/>
    4. <b>Admin Password:</b> <code>bhupesh@123</code>
    """
    b_data = [[Paragraph(bottom_box, styles['BodyTxt'])]]
    b_table = Table(b_data, colWidths=[530])
    b_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), ACCENT_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1.2, SECONDARY),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(b_table)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated: {output_filename}")


if __name__ == "__main__":
    out_dir = r"c:\Users\bhupe\OneDrive\Desktop\zeniva-ai"
    out_file1 = os.path.join(out_dir, "Zeniva_AI_New_User_Setup_Guide.pdf")
    build_guide_pdf(out_file1)

    # Also copy to frontend/public for instant web access
    public_dir = os.path.join(out_dir, "frontend", "public")
    os.makedirs(public_dir, exist_ok=True)
    out_file2 = os.path.join(public_dir, "Zeniva_AI_New_User_Setup_Guide.pdf")
    import shutil
    shutil.copyfile(out_file1, out_file2)
    print(f"Copied to public web path: {out_file2}")
