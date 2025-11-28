import { Heart, Download, Eye, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface NoteCardProps {
  id: string;
  title: string;
  subject: string;
  branch: string;
  semester: string;
  uploadedBy: string;
  uploadDate: string;
  likes: number;
  downloads: number;
  fileType: string;
}

export const NoteCard = ({
  id,
  title,
  subject,
  branch,
  semester,
  uploadedBy,
  uploadDate,
  likes,
  downloads,
  fileType,
}: NoteCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-7 hover-lift hover-glow transition-smooth group">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-xl text-foreground mb-2 line-clamp-2 group-hover:gradient-text transition-smooth">{title}</h3>
            <p className="text-sm text-muted-foreground">{subject}</p>
          </div>
          <Badge variant="secondary" className="ml-2 glass">
            {fileType}
          </Badge>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span>{uploadedBy}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{uploadDate}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs glass">
            {branch}
          </Badge>
          <Badge variant="outline" className="text-xs glass">
            Sem {semester}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span className="font-medium">{likes}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Download className="h-4 w-4" />
            <span className="font-medium">{downloads}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3">
          <Link to={`/note/${id}`} className="flex-1">
            <Button variant="outline" className="w-full glass hover-lift" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
          <Button className="flex-1 gradient-primary hover-glow" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};
