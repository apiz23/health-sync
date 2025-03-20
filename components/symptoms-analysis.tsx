const SymptomAnalysis = ({ symptoms }: { symptoms: string[] }) => {
    return (
        <div className="mt-4 space-y-2">
            <h4 className="font-medium">Possible Conditions:</h4>
            <div className="space-y-2">
                {symptoms.map((symptom, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-blue-50 rounded-md"
                    >
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>{symptom}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
