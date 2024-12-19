'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { GalleryItem } from '@/types/gallery';

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch gallery items');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery items');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      toast.error('Please provide both image and title');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', title);
    if (description) formData.append('description', description);

    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const newImage = await response.json();
      setImages([...images, newImage]);
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete image');

      setImages(images.filter(img => img._id !== id));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gallery Management</h1>
      
      <div className="mb-8 space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        <Input
          type="text"
          placeholder="Image Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
        <Input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !title || loading}
          className="w-full"
        >
          {loading ? 'Uploading...' : <><Plus className="mr-2 h-4 w-4" /> Add Image</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image._id}>
            <CardContent className="p-4">
              <div className="relative aspect-video">
                <Image
                  src={image.image}
                  alt={image.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{image.title}</p>
                  {image.description && (
                    <p className="text-sm text-gray-500">{image.description}</p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(image._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
