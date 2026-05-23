from fastapi import APIRouter, Response, HTTPException
from services.report_service import ReportService

router = APIRouter()
report_service = ReportService()

@router.get("/json")
async def get_report_json():
    try:
        json_data = await report_service.generate_json()
        return Response(content=json_data, media_type="application/json", headers={
            "Content-Disposition": "attachment; filename=incident_report.json"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/csv")
async def get_report_csv():
    try:
        csv_data = await report_service.generate_csv()
        return Response(content=csv_data, media_type="text/csv", headers={
            "Content-Disposition": "attachment; filename=telemetry_export.csv"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pdf")
async def get_report_pdf():
    try:
        pdf_data = await report_service.generate_pdf()
        return Response(content=pdf_data, media_type="application/pdf", headers={
            "Content-Disposition": "attachment; filename=incident_report.pdf"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
