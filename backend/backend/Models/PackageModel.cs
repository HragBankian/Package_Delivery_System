namespace backend.DatabaseClasses;

public class PackageModel
{
    public double weight { get; set; }              
    public double length { get; set; }
    public double width { get; set; }
    public double height { get; set; }
    public PackageCategory category { get; set; }   
    public bool isFragile { get; set; } 
}

public enum PackageCategory
{
    Standard,
    Hazardous,
    Valuable,
}