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
    <div className="glass-card rounded-xl p-6 hover-lift">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{subject}</p>
          </div>
          <Badge variant="secondary" className="ml-2">
            {fileType}
          </Badge>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{uploadedBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{uploadDate}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {branch}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Sem {semester}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Download className="h-4 w-4" />
            <span>{downloads}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link to={`/note/${id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
          <Button className="flex-1" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};
